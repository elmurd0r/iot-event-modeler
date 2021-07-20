import BpmnModeler from 'bpmn-js/lib/Modeler';

import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

import diagramXML from '../resources/diagram1.bpmn';

import customModule from './custom';

import qaExtension from '../resources/qa';

const HIGH_PRIORITY = 1500;

const containerEl = document.getElementById('container'),
      qualityAssuranceEl = document.getElementById('quality-assurance'),
      suitabilityScoreEl = document.getElementById('suitability-score'),
      lastCheckedEl = document.getElementById('last-checked'),
      okayEl = document.getElementById('okay'),
      formEl = document.getElementById('form'),
      warningEl = document.getElementById('warning'),
      saveBtn = document.getElementById('saveBtn');


// create modeler
const bpmnModeler = new BpmnModeler({
  container: containerEl,
  additionalModules: [
    customModule
  ],
  moddleExtensions: {
    qa: qaExtension
  }
});


saveBtn.addEventListener('click', (event)=>{
  bpmnModeler.saveXML({format: true}).then(({ xml }) => console.log(xml));
})

// import XML
bpmnModeler.importXML(diagramXML).then(() => {

}).catch((err) => {
  console.error(err);
});

function getExtensionElement(element, type) {
  if (!element.extensionElements) {
    return;
  }

  return element.extensionElements.values.filter((extensionElement) => {
    return extensionElement.$instanceOf(type);
  })[0];
}
