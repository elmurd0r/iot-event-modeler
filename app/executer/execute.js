const {EventEmitter} = require('events');
const {Engine} = require('bpmn-engine');

const {XMLHttpRequest} = require("xmlhttprequest");

import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer';


import customModule from '../custom/executer';

import iotExtension from '../../resources/iot.json';

import camundaExtension from '../../resources/camunda.json';

const containerEl = document.getElementById('js-canvas');

const processModel = sessionStorage.getItem('xml') ? sessionStorage.getItem('xml') : '';

const runBtn = document.getElementById('runBtn');




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


let parseString = require('xml2js').parseString;

listener.on('activity.start', (start) => {

  let start_t = new Date().getTime();

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


          if (inputsBoolean != undefined) {
            let propBooleanValue = inputsBoolean[0]['camunda:properties'][0]['camunda:property'][0]['$'].value;
            while (whileBool) {
              var xhr = new XMLHttpRequest();
              xhr.open('GET', sensVal, false);
              xhr.send(null);


              if (xhr.status === 200) {
                let resp = JSON.parse(xhr.responseText);

                if (resp.state === propBooleanValue) {
                  console.log(resp.name + " reached state " + resp.state);
                  whileBool = false;
                } else {
                  whileBool = true;
                  console.log("WAIT UNTIL " + resp.name + " with state "+ resp.state +" reached " + propBooleanValue + " state");
                }
              } else {
                console.log("HTTP GET FAILED!! - DataInputAssociation SENSOR");
              }
            }
          } else {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', sensVal, false);
            xhr.send(null);

            if (xhr.status === 200) {
              let resp = JSON.parse(xhr.responseText);
              start.environment.variables.input = resp.vendor;
              console.log("HTTP GET successfully completed");
              console.log('Name: ' + sensName + ' Type: ' + sensType + ', Value: ' + sensVal);
            } else {
              console.log("HTTP GET FAILED!! - DataInputAssociation SENSOR");
            }
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

          var _xhr = new XMLHttpRequest();
          _xhr.open('POST', actVal, false);
          _xhr.setRequestHeader('Content-Type', 'application/json', 'Access-Control-Allow-Origin');
          _xhr.send(null);

          if (_xhr.status === 200) {
            //let resp = JSON.parse(_xhr.responseText);
            console.log("HTTP POST successfully completed");
            console.log('Name: ' + actName + ' Type: ' + actType + ', Value: ' + actVal);
          } else {
            console.log("HTTP POST FAILED!! - DataOutputAssociation ACTOR");
          }
        });
      }
    }
  });
  let end_t = new Date().getTime();

  let time = end_t - start_t;
  console.log("EXECUTION TIME: "+ time);

  let elements = bpmnViewer.get('elementRegistry').find(function(element) {
    return  element.id === start.id;
  });

  highlightElement(elements);
  addOverlays(elements, time);
  fillSidebar("Done", start.name, start.id, time, start.type);

});

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

  stateCell.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="green" class="bi bi-check-circle" viewBox="0 0 16 16">\n' +
      '  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>\n' +
      '  <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>\n' +
      '</svg>';
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
