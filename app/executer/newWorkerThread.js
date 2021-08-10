const {EventEmitter} = require("events");
const {Engine} = require("bpmn-engine");

const {XMLHttpRequest} = require("xmlhttprequest");

import iotExtension from '../../resources/iot.json';

import camundaExtension from '../../resources/camunda.json';


const listener = new EventEmitter();

self.onmessage = function handleMessageFromMain(msg) {
    console.log("message from main received in worker:", msg);
    let processModel = msg.data;
    console.log(processModel);
}

