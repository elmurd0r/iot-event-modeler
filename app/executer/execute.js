import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer';


import diagramXML from '../../resources/diaGateway.bpmn';

import customModule from '../custom/executer';

import iotExtension from '../../resources/iot.json';

import camundaExtension from '../../resources/camunda.json';

const containerEl = document.getElementById('js-canvas');


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

// import XML
bpmnViewer.importXML(diagramXML).then(() => {

}).catch((err) => {
  console.error(err);
});
