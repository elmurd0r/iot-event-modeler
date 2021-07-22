import BpmnModeler from 'bpmn-js/lib/Modeler';
let propertiesPanelModule = require('bpmn-js-properties-panel'),
    propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/bpmn');


import diagramXML from '../resources/diagram1.bpmn';

import customModule from './custom';

import qaExtension from '../resources/qa';

const containerEl = document.getElementById('js-canvas'),
      panel = document.getElementById('js-properties-panel'),
      saveXML = document.getElementById('saveXML'),
      saveSVG = document.getElementById('saveSVG');


// create modeler
const bpmnModeler = new BpmnModeler({
  container: containerEl,
  propertiesPanel: {
    parent: panel
  },
  additionalModules: [
    customModule,
    propertiesPanelModule,
    propertiesProviderModule
  ],
  taskResizingEnabled: true,
  moddleExtensions: {
    qa: qaExtension
  }
});

function setEncoded(link, name, data) {
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

// import XML
bpmnModeler.importXML(diagramXML).then(() => {

}).catch((err) => {
  console.error(err);
});
