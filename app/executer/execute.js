import confirmIcon from "../svg/Icons";

const {EventEmitter} = require('events');
const {Engine} = require('bpmn-engine');

const {XMLHttpRequest} = require("xmlhttprequest");

import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer';


import customModule from '../custom/executer';

import iotExtension from '../../resources/iot.json';

import camundaExtension from '../../resources/camunda.json';

const axios = require('axios').default;

const containerEl = document.getElementById('js-canvas');

const processModel = sessionStorage.getItem('xml') ? sessionStorage.getItem('xml') : '';

const parseString = require('xml2js').parseString;

const runBtn = document.getElementById('runBtn');
let start_t;


let end_t;
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

const listener = new EventEmitter();

const engine = Engine({
  name: 'execution example',
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

  let sens = '';
  let sensVal;
  let sensType;
  let sensName;

  let act = '';
  let actVal;
  let actType;
  let actName;

  let XMLtoJSON;


  parseString(processModel, function (err, data) {
    console.log("---------------");
    console.log(start.id);
    // Schleife, um jede Aktivität im Prozess zu überprüfen
    let process = data['bpmn2:definitions']['bpmn2:process'][0];
    let taskArray = process['bpmn2:task'];

    let dataObjectReference = process['bpmn2:dataObjectReference'];

    // Finde die ID der Aktivität welche gerade in der Engine ausgeführt werde (activity.start)
    let task = taskArray.find(task => task['$'].id === start.id);
    if (task) {
      let inputs = task['bpmn2:dataInputAssociation'];
      let outputs = task['bpmn2:dataOutputAssociation'];


      // Wenn es ein dataInputAssociation gibt bzw. dataOutputAssociation (siehe nächste else if) überprüfe ob es ein normales Datenobjekt ist oder ein IoT-Datenobjekt,
      // indem geprüft wird, ob "iot" in 'dataObjectReference' drin steht
      if (inputs) {
        // Wenn "iot" in 'dataObjectReference' steht, dann schreibe sowohl Type als auch Value in variablen rein um diese später weiter zu bearbeiten
        let inputIDArr = inputs.map(inputAssociation => inputAssociation['bpmn2:sourceRef'][0]);
        let sensorArr = dataObjectReference.filter(ref => ref['$']['iot:type'] === 'sensor');
        let taskSensors = sensorArr.filter(sensor => inputIDArr.includes(sensor['$'].id));
        let inputsBoolean = task['bpmn2:extensionElements'];
        let whileBool = true;

        taskSensors.forEach(sensor => {
          sensType = sensor['$']['iot:type'];
          sensVal = sensor['$']['iot:value'];
          sensName = sensor['$'].name;

          console.log(inputsBoolean);
          if (inputsBoolean != undefined) {
            let propBooleanValue = inputsBoolean[0]['camunda:properties'][0]['camunda:property'][0]['$'].value;


            function axiosGet() {
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

          } else {
              axios.get( sensVal, {timeout: 5000}).then((resp)=>{
                start.environment.variables.input = resp.data.vendor;
                console.log("HTTP GET successfully completed");
                console.log('Name: ' + sensName + ' Type: ' + sensType + ', Value: ' + sensVal);
                start.signal();
              }).catch((e)=>{
                console.log(e);
                console.log("HTTP GET FAILED!! - DataInputAssociation SENSOR");
                engine.stop();
              });
          }
        });
      }


      if (outputs) {
        let outputIDArr = outputs.map(outputAssociation => outputAssociation['bpmn2:targetRef'][0]);
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
            engine.stop();
          });
        });
      }
      if(!inputs && !outputs) {
        start.signal();
      }
    }
  });
})



listener.on('activity.end', (element)=>{
  end_t = new Date().getTime();

  let time = end_t - start_t;
  console.log("EXECUTION TIME: "+ time);


  let currentElement = bpmnViewer.get('elementRegistry').find((elem)=>elem.id === element.id);

  highlightElement(currentElement);
  addOverlays(currentElement, time);
  fillSidebar("Done", element.name, element.id, time, element.type);
})



function fillSidebar(state, name, id, time, type) {
  let table = document.getElementById("overlayTable");
  let tableLength = table.rows.length;
  let row = table.insertRow(tableLength);

  let stateCell = row.insertCell(0);
  let nameCell = row.insertCell(1);
  let idCell = row.insertCell(2);
  let typeCell = row.insertCell(3);
  let executionTimeCell = row.insertCell(4);

  //'<span class="badge badge-primary">Primary</span>'

  stateCell.innerHTML = confirmIcon;
  nameCell.innerHTML = name;
  idCell.innerHTML = id;
  typeCell.innerHTML = type;
  executionTimeCell.innerHTML = time/1000 + " s";


}


const addOverlays= (elem, time) => {
  overlays.add(elem, {
    html: '<div class="overlay">Time:'+ time/1000+' s</div>',
    position: {
      left: 0,
      top:0
    }
  });
};


const highlightElement = (elem) => {
  elem.businessObject.di.set("fill", "rgba(66, 180, 21, 0.7)");
  const gfx = bpmnViewer.get("elementRegistry").getGraphics(elem);
  const type = elem.waypoints ? "connection" : "shape";
  bpmnViewer.get("graphicsFactory").update(type, elem, gfx);
};



runBtn.addEventListener('click', (event)=>{
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
