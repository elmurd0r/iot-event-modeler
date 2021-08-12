import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer';
const {EventEmitter} = require('events');
const {Engine} = require('bpmn-engine');
const axios = require('axios').default;
const parseString = require('xml2js').parseString;

import {confirmIcon, errIcon} from "../svg/Icons";
import customModule from '../custom/executer';
import iotExtension from '../../resources/iot.json';
import camundaExtension from '../../resources/camunda.json';

const processModel = sessionStorage.getItem('xml') ? sessionStorage.getItem('xml') : '';
const containerEl = document.getElementById('js-canvas');
const runBtn = document.getElementById('runBtn');

let start_t;
let end_t;
let executedTasksArr = [];

// create modeler
const bpmnViewer = new NavigatedViewer({
  container: containerEl,
  additionalModules: [
    customModule
  ],
  moddleExtensions: {
    iot: iotExtension,
    camunda: camundaExtension
  }
});

let overlays = bpmnViewer.get('overlays');

// import XML
bpmnViewer.importXML(processModel).then(() => {
  bpmnViewer.get("canvas").zoom("fit-viewport", "auto");
}).catch((err) => {
  console.error(err);
});


//Engine stuff
const listener = new EventEmitter();

const engine = Engine({
  name: 'process model execution',
  source: processModel,
  moddleOptions: {
    iot: iotExtension,
    camunda: camundaExtension
  }
});

listener.on('activity.start', (start) => {
  start_t = new Date().getTime();
});

listener.on('activity.wait', (start) => {

  parseString(processModel, (err, data) => {
    console.log("---------------");
    console.log(start.id);

    let bpmnVersion = data['bpmn2:definitions'] ? 'bpmn2:' : '';

    let process = data[bpmnVersion+'definitions'][bpmnVersion+'process'][0];
    let taskArray = process[bpmnVersion+'task'];

    let dataObjectReference = process[bpmnVersion+'dataObjectReference'];

    // Finde die ID der Aktivität welche gerade in der Engine ausgeführt werde (activity.start)
    let task = taskArray.find(task => task['$'].id === start.id);
    if (task) {
      let inputs = task[bpmnVersion+'dataInputAssociation'];
      let outputs = task[bpmnVersion+'dataOutputAssociation'];

      if(!inputs && !outputs) {
        start.signal();
      }

      // Wenn es ein dataInputAssociation gibt bzw. dataOutputAssociation (siehe nächste else if) überprüfe ob es ein normales Datenobjekt ist oder ein IoT-Datenobjekt,
      // indem geprüft wird, ob "iot" in 'dataObjectReference' drin steht
      if (inputs) {
        let sens = '';
        let sensVal;
        let sensType;
        let sensName;
        // Wenn "iot" in 'dataObjectReference' steht, dann schreibe sowohl Type als auch Value in variablen rein um diese später weiter zu bearbeiten
        let inputIDArr = inputs.map(inputAssociation => inputAssociation[bpmnVersion+'sourceRef'][0]);
        let sensorArr = dataObjectReference.filter(ref => ref['$']['iot:type'] === 'sensor');
        let taskSensors = sensorArr.filter(sensor => inputIDArr.includes(sensor['$'].id));
        let inputsBoolean = task[bpmnVersion+'extensionElements'];

        taskSensors.forEach(sensor => {
          sensType = sensor['$']['iot:type'];
          sensVal = sensor['$']['iot:value'];
          sensName = sensor['$'].name;

          if (inputsBoolean != undefined) {
            let propBooleanValue = inputsBoolean[0]['camunda:properties'][0]['camunda:property'][0]['$'].value ? inputsBoolean[0]['camunda:properties'][0]['camunda:property'][0]['$'].value : null;
            if(propBooleanValue) {
              const axiosGet = () => {
                axios.get( sensVal, {timeout: 5000}).then((resp)=>{
                  if (resp.data.state === propBooleanValue) {
                    console.log(resp.data.name + " reached state " + resp.data.state);
                    start.signal();
                  } else {
                    console.log("WAIT UNTIL " + resp.data.name + " with state "+ resp.data.state +" reached " + propBooleanValue + " state");
                    axiosGet();
                  }
                }).catch((e)=>{
                  console.log(e);
                  console.log("While loop axios error in input");
                });
              }
              axiosGet();
            }
          } else {
              axios.get( sensVal, {timeout: 5000}).then((resp)=>{
                start.environment.variables.input = resp.data.vendor;
                console.log("HTTP GET successfully completed");
                console.log('Name: ' + sensName + ' Type: ' + sensType + ', Value: ' + sensVal);
                start.signal();
              }).catch((e)=>{
                console.log(e);
                console.log("HTTP GET FAILED!! - DataInputAssociation SENSOR");
                highlightErrorElements(start.name, start.id, "Not executed" ,start.messageProperties.timestamp, start.type, e);
              });
          }
        });
      }

      if (outputs) {
        let actVal;
        let actType;
        let actName;

        let outputIDArr = outputs.map(outputAssociation => outputAssociation[bpmnVersion+'targetRef'][0]);
        let actorArr = dataObjectReference.filter(ref => ref['$']['iot:type'] === 'actor');
        let taskActors = actorArr.filter(actor => outputIDArr.includes(actor['$'].id));

        taskActors.forEach(actor => {
          actType = actor['$']['iot:type'];
          actVal = actor['$']['iot:value'];
          actName = actor['$'].name;


          axios.post( actVal, null, {timeout: 5000, headers: {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'}}).then((resp)=>{
            console.log("HTTP POST successfully completed");
            console.log('Name: ' + actName + ' Type: ' + actType + ', Value: ' + actVal);
            start.signal();
          }).catch((e)=>{
            console.log(e);
            console.log("HTTP POST FAILED!! - DataOutputAssociation ACTOR");
            highlightErrorElements(start.name, start.id, "Not executed" ,start.messageProperties.timestamp, start.type, e);
          });
        });
      }
    }
  });
})


listener.on('activity.end', (element)=>{
  end_t = new Date().getTime();
  let time = end_t - start_t;

  console.log("EXECUTION TIME: "+ time);

  let currentElement = bpmnViewer.get('elementRegistry').find((elem)=>elem.id === element.id);
  let timeStamp = timestampToDate(element.messageProperties.timestamp);

  highlightElement(currentElement, "rgba(66, 180, 21, 0.7)");
  addOverlays(currentElement, time);
  fillSidebar(confirmIcon, element.name, element.id, time, timeStamp, element.type);
  // -----------------
  executedTasksArr.push(element.id);
})

const highlightErrorElements = (name, id, time, timeStamp, type, errormsg) => {
  let notExecutedElements = bpmnViewer.get('elementRegistry').filter((elem)=>!executedTasksArr.includes(elem.id));

  highlightElementArr(notExecutedElements, "rgb(245,61,51)");
  let convertedTimeStamp = timestampToDate(timeStamp);

  fillSidebar(errIcon, name, id, time, convertedTimeStamp, type,errormsg);
  engine.stop();
}

const timestampToDate = (timestamp) => {
  let date = new Date(timestamp);
  let convertTimestamp = date.getDate()+
      "/"+(date.getMonth()+1)+
      "/"+date.getFullYear()+
      " "+date.getHours()+
      ":"+date.getMinutes();

  return convertTimestamp;
}


const fillSidebar = (state, name, id, time, timeStamp,type, errormsg) => {
  let table = document.getElementById("overlayTable");
  let tableLength = table.rows.length;
  let row = table.insertRow(tableLength);

  let stateCell = row.insertCell(0);
  let nameCell = row.insertCell(1);
  let idCell = row.insertCell(2);
  let typeCell = row.insertCell(3);
  let startTimeCell = row.insertCell(4);
  let executionTimeCell = row.insertCell(5);
  let errorMsgCell = row.insertCell(6);


  stateCell.innerHTML = state;
  nameCell.innerHTML = name;
  idCell.innerHTML = id;
  typeCell.innerHTML = type;
  startTimeCell.innerHTML = timeStamp;
  executionTimeCell.innerHTML = time/1000 + " s";
  errorMsgCell.innerHTML = errormsg;
}


const addOverlays = (elem, time) => {
  overlays.add(elem, {
    html: '<div class="overlay">Time:'+ time/1000+' s</div>',
    position: {
      left: 0,
      top:0
    }
  });
};

const highlightElement = (elem, colorStr) => {
  elem.businessObject.di.set("fill", colorStr);
  const gfx = bpmnViewer.get("elementRegistry").getGraphics(elem);
  const type = elem.waypoints ? "connection" : "shape";
  bpmnViewer.get("graphicsFactory").update(type, elem, gfx);
};

const highlightElementArr = (elementArr, colorStr) => {
  elementArr.forEach((elem)=>highlightElement(elem, colorStr));
}

const resetView = () => {
  // clear executed task array
  executedTasksArr.length = 0;
  // Alle BPMN Elemente aus der elementRegistry holen
  let allElements = bpmnViewer.get('elementRegistry').filter((elem)=>elem.id);
  overlays.clear()
  // Schleife um alle BPMN Elemente wieder mit der Standardfarbe zu färben
  highlightElementArr(allElements, "rgba(255,255,255,1.0)")
}

runBtn.addEventListener('click', (event)=>{
  resetView();

  engine.execute({
    listener,
    variables: {
      input: 21
    }
  }, (err) => {
    if (err) throw err;
  });
})


document.getElementById('openbtn').addEventListener('click', (event)=>{
    document.getElementById("mySidebar").style.display = "block";
})

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
document.getElementById('closebtn').addEventListener('click', (event)=>{
  document.getElementById("mySidebar").style.display = "none";
})
