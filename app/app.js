import BpmnModeler from 'bpmn-js/lib/Modeler';
let propertiesPanelModule = require('bpmn-js-properties-panel'),
    //propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/bpmn');
    propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/camunda');

import iotPropertiesProvider from './custom/iot-panel/';


import diagramXML from '../resources/diaGateway.bpmn';
import newDiagram from '../resources/newDiagram.bpmn';

import customModule from './custom';

import iotExtension from '../resources/iot.json';

import camundaExtension from '../resources/camunda.json';

const containerEl = document.getElementById('js-canvas'),
      container = document.getElementById('js-drop-zone'),
      panel = document.getElementById('js-properties-panel'),
      saveXML = document.getElementById('saveXML'),
      saveSVG = document.getElementById('saveSVG'),
      btnExec = document.getElementById('btnExec'),
      newDiaBtn = document.getElementById('js-create-diagram');


// create modeler
const bpmnModeler = new BpmnModeler({
  container: containerEl,
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

    container.classList.add('with-error');
    container.classList.remove('with-diagram');

    container.find('.error pre').text(err.message);

    console.error(err);
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


