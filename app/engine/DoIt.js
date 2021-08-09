'use strict';

const {EventEmitter} = require('events');
const {Engine} = require('bpmn-engine');
const util = require('util');

const {XMLHttpRequest} = require("xmlhttprequest");


const source = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:iot="http://some-company/schema/bpmn/iot" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:qa="http://some-company/schema/bpmn/qa" id="_RdgBELNaEeSYkoSLDs6j-w" targetNamespace="http://activiti.org/bpmn">
  <bpmn2:process id="Process_1" isExecutable="true">
    <bpmn2:startEvent id="Event_1yx6juh">
      <bpmn2:outgoing>Flow_1se0sq7</bpmn2:outgoing>
    </bpmn2:startEvent>
    <bpmn2:task id="Activity_0j6bh35" name="Get Data">
      <bpmn2:extensionElements>
        <camunda:properties>
          <camunda:property name="boolean" value="0" />
        </camunda:properties>
      </bpmn2:extensionElements>
      <bpmn2:incoming>Flow_1se0sq7</bpmn2:incoming>
      <bpmn2:outgoing>Flow_0dmkgiw</bpmn2:outgoing>
      <bpmn2:property id="Property_05bfvdc" name="__targetRef_placeholder" />
      <bpmn2:dataInputAssociation id="DataInputAssociation_0b9k7n7">
        <bpmn2:sourceRef>DataObjectReference_17rtrei</bpmn2:sourceRef>
        <bpmn2:targetRef>Property_05bfvdc</bpmn2:targetRef>
      </bpmn2:dataInputAssociation>
    </bpmn2:task>
    <bpmn2:sequenceFlow id="Flow_1se0sq7" sourceRef="Event_1yx6juh" targetRef="Activity_0j6bh35" />
    <bpmn2:exclusiveGateway id="Gateway_0pgqw4u">
      <bpmn2:incoming>Flow_0dmkgiw</bpmn2:incoming>
      <bpmn2:outgoing>Flow_099cul0</bpmn2:outgoing>
      <bpmn2:outgoing>Flow_09ydh4y</bpmn2:outgoing>
    </bpmn2:exclusiveGateway>
    <bpmn2:sequenceFlow id="Flow_0dmkgiw" sourceRef="Activity_0j6bh35" targetRef="Gateway_0pgqw4u" />
    <bpmn2:task id="Activity_1u3g49x" name="Do Something">
      <bpmn2:extensionElements>
        <camunda:properties>
          <camunda:property name="boolean" value="1" />
        </camunda:properties>
      </bpmn2:extensionElements>
      <bpmn2:incoming>Flow_099cul0</bpmn2:incoming>
      <bpmn2:outgoing>Flow_1bs1hl9</bpmn2:outgoing>
      <bpmn2:property id="Property_0v48tup" name="__targetRef_placeholder" />
      <bpmn2:dataInputAssociation id="DataInputAssociation_1ba93a8">
        <bpmn2:sourceRef>DataObjectReference_1ysj32r</bpmn2:sourceRef>
        <bpmn2:targetRef>Property_0v48tup</bpmn2:targetRef>
      </bpmn2:dataInputAssociation>
    </bpmn2:task>
    <bpmn2:sequenceFlow id="Flow_099cul0" sourceRef="Gateway_0pgqw4u" targetRef="Activity_1u3g49x">
      <bpmn2:conditionExpression xsi:type="bpmn2:tFormalExpression" language="javaScript">next(null, this.environment.variables.input &gt; 10);</bpmn2:conditionExpression>
    </bpmn2:sequenceFlow>
    <bpmn2:task id="Activity_1lbfvku" name="Task B">
      <bpmn2:incoming>Flow_09ydh4y</bpmn2:incoming>
      <bpmn2:outgoing>Flow_02rnm2k</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:sequenceFlow id="Flow_09ydh4y" sourceRef="Gateway_0pgqw4u" targetRef="Activity_1lbfvku">
      <bpmn2:conditionExpression xsi:type="bpmn2:tFormalExpression" language="JavaScript">next(null, this.environment.variables.input == 10047);</bpmn2:conditionExpression>
    </bpmn2:sequenceFlow>
    <bpmn2:exclusiveGateway id="Gateway_04yu78z">
      <bpmn2:incoming>Flow_1bs1hl9</bpmn2:incoming>
      <bpmn2:incoming>Flow_02rnm2k</bpmn2:incoming>
      <bpmn2:outgoing>Flow_1nzvzva</bpmn2:outgoing>
    </bpmn2:exclusiveGateway>
    <bpmn2:sequenceFlow id="Flow_1bs1hl9" sourceRef="Activity_1u3g49x" targetRef="Gateway_04yu78z" />
    <bpmn2:sequenceFlow id="Flow_02rnm2k" sourceRef="Activity_1lbfvku" targetRef="Gateway_04yu78z" />
    <bpmn2:endEvent id="Event_03jt82z">
      <bpmn2:incoming>Flow_1nzvzva</bpmn2:incoming>
    </bpmn2:endEvent>
    <bpmn2:sequenceFlow id="Flow_1nzvzva" sourceRef="Gateway_04yu78z" targetRef="Event_03jt82z" />
    <bpmn2:dataObjectReference id="DataObjectReference_17rtrei" dataObjectRef="DataObject_09d2p9m" iot:value="http://192.168.2.164:62400/api/v1/device/f4ebab63-c674-4c49-bd3f-0e1f4704fe2d" iot:type="sensor" />
    <bpmn2:dataObject id="DataObject_09d2p9m" />
    <bpmn2:dataObjectReference id="DataObjectReference_1ysj32r" dataObjectRef="DataObject_1r7b5ak" iot:value="http://192.168.2.164:62400/api/v1/device/890a8a78-e926-43ef-8dce-02aecf11947c" iot:type="sensor" />
    <bpmn2:dataObject id="DataObject_1r7b5ak" />
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNEdge id="Flow_1nzvzva_di" bpmnElement="Flow_1nzvzva">
        <di:waypoint x="755" y="240" />
        <di:waypoint x="832" y="240" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_02rnm2k_di" bpmnElement="Flow_02rnm2k">
        <di:waypoint x="630" y="350" />
        <di:waypoint x="730" y="350" />
        <di:waypoint x="730" y="265" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1bs1hl9_di" bpmnElement="Flow_1bs1hl9">
        <di:waypoint x="630" y="240" />
        <di:waypoint x="705" y="240" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_09ydh4y_di" bpmnElement="Flow_09ydh4y">
        <di:waypoint x="450" y="265" />
        <di:waypoint x="450" y="350" />
        <di:waypoint x="530" y="350" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_099cul0_di" bpmnElement="Flow_099cul0">
        <di:waypoint x="475" y="240" />
        <di:waypoint x="530" y="240" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0dmkgiw_di" bpmnElement="Flow_0dmkgiw">
        <di:waypoint x="370" y="240" />
        <di:waypoint x="425" y="240" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1se0sq7_di" bpmnElement="Flow_1se0sq7">
        <di:waypoint x="218" y="240" />
        <di:waypoint x="270" y="240" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Event_1yx6juh_di" bpmnElement="Event_1yx6juh">
        <dc:Bounds x="182" y="222" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0j6bh35_di" bpmnElement="Activity_0j6bh35">
        <dc:Bounds x="270" y="200" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_0pgqw4u_di" bpmnElement="Gateway_0pgqw4u" isMarkerVisible="true">
        <dc:Bounds x="425" y="215" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1u3g49x_di" bpmnElement="Activity_1u3g49x">
        <dc:Bounds x="530" y="200" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1lbfvku_di" bpmnElement="Activity_1lbfvku">
        <dc:Bounds x="530" y="310" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_04yu78z_di" bpmnElement="Gateway_04yu78z" isMarkerVisible="true">
        <dc:Bounds x="705" y="215" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_03jt82z_di" bpmnElement="Event_03jt82z">
        <dc:Bounds x="832" y="222" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="DataObjectReference_17rtrei_di" bpmnElement="DataObjectReference_17rtrei">
        <dc:Bounds x="302" y="105" width="36" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="DataObjectReference_1ysj32r_di" bpmnElement="DataObjectReference_1ysj32r">
        <dc:Bounds x="562" y="105" width="36" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="DataInputAssociation_0b9k7n7_di" bpmnElement="DataInputAssociation_0b9k7n7">
        <di:waypoint x="320" y="155" />
        <di:waypoint x="320" y="200" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="DataInputAssociation_1ba93a8_di" bpmnElement="DataInputAssociation_1ba93a8">
        <di:waypoint x="580" y="155" />
        <di:waypoint x="580" y="200" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>
`;

const listener = new EventEmitter();

const engine = Engine({
    name: 'execution example',
    source
});

listener.once('wait', (task) => {
    task.signal({
        ioSpecification: {
            dataOutputs: [{
                id: 'userInput',
                value: 'von Rosen',
            }]
        }
    });
});

var parseString = require('xml2js').parseString;

const sendGetRequest = async (link) => {
    try {
        const resp = await axios.get(link);
        console.log(resp.data);
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};


listener.on('activity.start', (start) => {

    var start_t = new Date().getTime();

    let sens = '';
    let sensVal;
    let sensType;
    let sensName;

    let act = '';
    let actVal;
    let actType;
    let actName;

    let XMLtoJSON;


    parseString(source, function (err, data) {
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
    var end_t = new Date().getTime();
    var time = end_t - start_t;
    console.log("EXECUTION TIME: "+ time);
});





engine.once('activity.start', (execution) => {
    //console.log(execution);
});

engine.execute({
    listener,
    variables: {
        input: 21
    }
}, (err) => {
    if (err) throw err;
});
