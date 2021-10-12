import BpmnModeler from 'bpmn-js/lib/Modeler';
let propertiesPanelModule = require('bpmn-js-properties-panel'),
    propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/camunda');

import iotPropertiesProvider from './custom/iot-panel/';
import newDiagram from '../resources/newDiagram.bpmn';
import customModule from './custom';
import iotExtension from '../resources/iot.json';
import camundaExtension from '../resources/camunda.json';
import {is, getBusinessObject} from "bpmn-js/lib/util/ModelUtil";

const containerEl = document.getElementById('js-canvas'),
      container = document.getElementById('js-drop-zone'),
      panel = document.getElementById('js-properties-panel'),
      saveXML = document.getElementById('saveXML'),
      saveSVG = document.getElementById('saveSVG'),
      btnExec = document.getElementById('btnExec'),
      newDiaBtn = document.getElementById('js-create-diagram'),
      newDia = document.getElementById('newDia');

const processModel = sessionStorage.getItem('xml') ? sessionStorage.getItem('xml') : null;

// create modeler
const bpmnModeler = new BpmnModeler({
  container: containerEl,
  keyboard: { bindTo: document },
  propertiesPanel: {
    parent: panel
  },
  additionalModules: [
    customModule,
    propertiesPanelModule,
    propertiesProviderModule,
    iotPropertiesProvider
  ],
  taskResizingEnabled: true,
  moddleExtensions: {
    iot: iotExtension,
    camunda: camundaExtension
  }
});


const setEncoded = (link, name, data) => {
  let encodedData = encodeURIComponent(data);

  if (data) {
    link.setAttribute('href', 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData)
    link.setAttribute('download', name);
  }
}

saveXML.addEventListener('click', (event)=>{
  bpmnModeler.saveXML({format: true}).then(({ xml }) => {
    setEncoded(saveXML, 'diagram.bpmn', xml);
  }).catch((e)=>{
    setEncoded(saveXML, 'diagram.bpmn', null);
  });
})

saveSVG.addEventListener('click', (event)=>{
  bpmnModeler.saveSVG().then(({ svg }) => {
    setEncoded(saveSVG, 'diagram.svg', svg);
  }).catch((e)=>{
    setEncoded(saveSVG, 'diagram.svg', null);
  });
})

btnExec.addEventListener('click', (event)=>{
  bpmnModeler.saveXML({format: true}).then(({ xml }) => {
    sessionStorage.setItem('xml', xml)
  }).catch((e)=>{
    console.log("save xml failure");
  })
})

newDiaBtn.addEventListener('click', (e)=>{
    e.stopPropagation();
    e.preventDefault();
    createNewDiagram();
})

newDia.addEventListener('click', (e)=>{
  e.stopPropagation();
  e.preventDefault();
  createNewDiagram();
})

const sriptTextAreaListener = (event) =>{
  let element = event.target;
  if(element.id === 'cam-script-val'){
    element.addEventListener('focusout', (e)=>{
      if(!e.target.value.includes('next(null')) {
        let ID = document.getElementById("camunda-id").value;
        let taskArr = bpmnModeler.get('elementRegistry').filter(element => is(element, "bpmn:SequenceFlow"));
        let task = taskArr.find(task => task.id === ID);
        let businessObj = getBusinessObject(task);
        businessObj.conditionExpression.body = 'next(null, this.environment.variables.' + businessObj.conditionExpression.body + ');';
        e.target.value = businessObj.conditionExpression.body;
      }
    })
  }
}
document.addEventListener( "click", sriptTextAreaListener );

//listener to remove keyboard listener while inside panel
panel.addEventListener('click', e => {
  let keyboard = bpmnModeler.get('keyboard');
  if (keyboard.getBinding()) {
    keyboard.unbind();
  }
});
//add keyboard listener when click on canvas
containerEl.addEventListener('click', e => {
  let keyboard = bpmnModeler.get('keyboard');
  if (!keyboard.getBinding()) {
    keyboard.bind(document)
  }
});


const createNewDiagram = () => {
  openDiagram(newDiagram);
}

const openDiagram = async (xml) => {
  try {
    await bpmnModeler.importXML(xml);
    bpmnModeler.get("canvas").zoom("fit-viewport", "auto");

    container.classList.remove('with-error');
    container.classList.add('with-diagram');
    //document.getElementsByClassName('properties-panel-parent').item(0).style.display = 'block';
  } catch (err) {
    console.error(err);
    container.classList.add('with-error');
    container.classList.remove('with-diagram');
    document.getElementById('pre-err-container').innerHTML = err.message;
  }
}

const registerFileDrop = (container, callback) => {

  const handleFileSelect = (e) => {
    e.stopPropagation();
    e.preventDefault();

    let files = e.dataTransfer.files;

    let file = files[0];

    let reader = new FileReader();

    reader.onload = (e) => {

      let xml = e.target.result;

      callback(xml);
    };

    reader.readAsText(file);
  }

  const handleDragOver = (e) => {
    console.log("drag over");
    e.stopPropagation();
    e.preventDefault();

    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  container.addEventListener('dragover', handleDragOver, false);
  container.addEventListener('drop', handleFileSelect, false);
}


// file drag / drop ///////////////////////

// check file api availability
if (!window.FileList || !window.FileReader) {
  window.alert(
      'Looks like you use an older browser that does not support drag and drop. ' +
      'Try using Chrome, Firefox or the Internet Explorer > 10.');
} else {
  registerFileDrop(container, openDiagram);
}

if(processModel) {
  openDiagram(processModel);
}


document.getElementById('hidePanelButton').addEventListener('click', () => {
  let propertiesPanel = document.getElementById('js-properties-panel');
  let hidePanelButton = document.getElementById('hidePanelButton');

  if(propertiesPanel.style.display === 'none') {
    propertiesPanel.style.display = "block";
    hidePanelButton.style.right = "calc(100vw/3 - 35px)";
  } else {
    propertiesPanel.style.display = "none";
    hidePanelButton.style.right = "-30px";
  }
})
