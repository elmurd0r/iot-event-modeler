const workerpool = require('workerpool');
const {default: axios} = require("axios");
const {isNil} = require("min-dash");
import {convertInputToBooleanOrKeepType, convertInputToFloatOrKeepType, getResponseByAttributeAccessor} from './ExecuteHelper'


const sensorCall = (businessObj) => {
    return new Promise((resolve, reject) => {

        let url = businessObj.extensionElements?.values.filter(element => element['$type'] === 'iot:Properties')[0].values[0].url;
        let key = businessObj.extensionElements?.values.filter(element => element['$type'] === 'iot:Properties')[0].values[0].key;

        if(url && key) {
            axios.get( url ).then((resp)=>{
                let value = resp.data;
                let keyArr = key.split('.');
                keyArr.forEach(k => {
                    value = value[k];
                });
                if(!isNil(value)) {
                    console.log("HTTP GET successfully completed");
                    console.log('Name: ' + key + ', Value: ' + value);
                    workerpool.workerEmit({status: "HTTP GET successfully completed"});
                    workerpool.workerEmit({status: 'Name: ' + key + ', Value: ' + value});
                    resolve({value: value});
                } else {
                    console.log('response value is NaN');
                    workerpool.workerEmit({status: 'response value is Nil'});
                    reject(new Error(businessObj.id));
                }
            }).catch((e)=>{
                console.log(e);
                console.log("HTTP GET FAILED!! - DataInputAssociation SENSOR");
                workerpool.workerEmit({status: "HTTP GET FAILED!! - DataInputAssociation SENSOR: " + e});
                reject(new Error(businessObj.id));
            });
        } else {
            console.log("Error in extensionsElement in IoT sensor Task");
            workerpool.workerEmit({status: "Error in extensionsElement in IoT sensor Task"});
            reject(new Error(businessObj.id));
        }
    })
}


const sensorCallGroup = (url, key, id) => {
    return new Promise((resolve, reject) => {
        if(url && key) {
            axios.get( url ).then((resp)=>{
                let value = resp.data;
                let keyArr = key.split('.');
                keyArr.forEach(k => {
                    value = value[k];
                });
                if(!isNil(value)) {
                    value = parseFloat(value);
                    console.log("HTTP GET successfully completed");
                    console.log('Name: ' + key + ', Value: ' + value);
                    workerpool.workerEmit({status: "HTTP GET successfully completed"});
                    workerpool.workerEmit({status: 'Name: ' + key + ', Value: ' + value});
                    resolve({value: value});
                } else {
                    console.log('response value is NaN');
                    workerpool.workerEmit({status: 'response value is Nil'});
                    reject(new Error(id));
                }
            }).catch((e)=>{
                console.log(e);
                console.log("HTTP GET FAILED!! - DataInputAssociation SENSOR");
                workerpool.workerEmit({status: "HTTP GET FAILED!! - DataInputAssociation SENSOR: " + e});
                reject(new Error(id));
            });
        } else {
            console.log("Error in extensionsElement in IoT sensor Task");
            workerpool.workerEmit({status: "Error in extensionsElement in IoT sensor Task"});
            reject(new Error(id));
        }
    })
}


const actorCall = (businessObj) => {
    return new Promise(((resolve, reject) => {
        let eventValUrl = businessObj.extensionElements?.values.filter(element => element['$type'] === 'iot:Properties')[0].values[0].url;
        if(eventValUrl) {
            axios.post( eventValUrl, {}, { headers: {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'}}).then((resp)=>{
                console.log("HTTP POST successfully completed");
                console.log('Executed call: ' + eventValUrl);
                workerpool.workerEmit({status: "HTTP POST successfully completed"});
                workerpool.workerEmit({status: 'Executed call: ' + eventValUrl});
                resolve();
            }).catch((e)=>{
                console.log(e);
                console.log("HTTP POST FAILED!! - DataOutputAssociation ACTOR");
                workerpool.workerEmit({status: "HTTP POST FAILED!! - DataOutputAssociation ACTOR: "+e});
                reject(new Error(businessObj.id));
            });
        } else {
            console.log("Error in extensionsElement in IoT actor Task");
            workerpool.workerEmit({status: "Error in extensionsElement in IoT actor Task"});
            reject(new Error(businessObj.id));
        }
    }))
}


const actorCallGroup = (url, id) => {
    return new Promise(((resolve, reject) => {
        if(url) {
            axios.post( url, {}, { headers: {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'}}).then((resp)=>{
                console.log("HTTP POST successfully completed");
                console.log('Executed call: ' + url);
                workerpool.workerEmit({status: "HTTP POST successfully completed"});
                workerpool.workerEmit({status: 'Executed call: ' + url});
                resolve();
            }).catch((e)=>{
                console.log(e);
                console.log("HTTP POST FAILED!! - DataOutputAssociation ACTOR");
                workerpool.workerEmit({status: "HTTP POST FAILED!! - DataOutputAssociation ACTOR: "+e});
                reject(new Error(id));
            });
        } else {
            console.log("Error in extensionsElement in IoT actor Task");
            workerpool.workerEmit({status: "Error in extensionsElement in IoT actor Task"});
            reject(new Error(id));
        }
    }))
}

const sensorCatchArtefact = (businessObj, start_t, timeout) => {
    console.log(businessObj);
    return new Promise((resolve, reject) => {
        console.log("TIMEOUT:" + timeout);

        let eventValue = businessObj.extensionElements?.values.filter(element => element['$type'] === 'iot:Properties')[0].values[0].url;
        let name = businessObj.extensionElements?.values.filter(element => element['$type'] === 'iot:Properties')[0].values[0].key;
        let mathOp = businessObj.extensionElements?.values.filter(element => element['$type'] === 'iot:Properties')[0].values[0].mathOP;
        let mathOpVal = businessObj.extensionElements?.values.filter(element => element['$type'] === 'iot:Properties')[0].values[0].value;

        if(eventValue && name && mathOp && mathOpVal){
            mathOpVal = convertInputToFloatOrKeepType(mathOpVal);
            const axiosGet = () => {
                let noTimeoutOccured =  new Date().getTime() - start_t <= timeout;
                if(!timeout || noTimeoutOccured) {
                    axios.get(eventValue).then((resp) => {
                        let resVal = getResponseByAttributeAccessor(resp.data, name)
                        if (!isNil(resVal)) {
                            switch (mathOp) {
                                case '<' :
                                    if (parseFloat(resVal) < mathOpVal) {
                                        console.log(name + " reached state " + resVal);
                                        workerpool.workerEmit({status: name + " reached state " + resVal});
                                        resolve(resVal);
                                    } else {
                                        console.log("WAIT UNTIL " + name + " with state " + resVal + " reached");
                                        //fillSidebarRightLog("WAIT UNTIL " + name + " with state " + resVal + " reached");
                                        workerpool.workerEmit({status: "WAIT UNTIL " + name + " with state " + resVal + " reached"});
                                        axiosGet();
                                    }
                                    break;
                                case '=' :
                                    mathOpVal = convertInputToBooleanOrKeepType(mathOpVal)
                                    if (resVal === mathOpVal) {
                                        console.log(name + " reached state " + resVal);
                                        workerpool.workerEmit({status: name + " reached state " + resVal});
                                        resolve(resVal);
                                    } else {
                                        console.log("WAIT UNTIL " + name + " with state " + resVal + " reached");
                                        workerpool.workerEmit({status: "WAIT UNTIL " + name + " with state " + resVal + " reached"});
                                        axiosGet();
                                    }
                                    break;
                                case '>' :
                                    if (parseFloat(resVal) > mathOpVal) {
                                        console.log(name + " reached state " + resVal);
                                        workerpool.workerEmit({status: name + " reached state " + resVal});
                                        resolve(resVal);
                                    } else {
                                        console.log("WAIT UNTIL " + name + " with state " + resVal + " reached");
                                        workerpool.workerEmit({status: "WAIT UNTIL " + name + " with state " + resVal + " reached"});
                                        axiosGet();
                                    }
                                    break;
                                default:
                                    console.log("Default case stopped IoT start");
                                    workerpool.workerEmit({status: "Default case stopped IoT start"});
                                    reject(new Error(businessObj.id));
                            }
                        } else {
                            console.log("Key not in response - IoT start");
                            workerpool.workerEmit({status: "Key not in response - IoT start"});
                        }
                    }).catch((e) => {
                        console.log(e);
                        console.log("Recursion axios error in input");
                        workerpool.workerEmit({status: "Recursion axios error in input: " + e});
                        reject(new Error(businessObj.id));
                    });
                } else {
                    workerpool.workerEmit({status: "Timeout occurred"});
                    reject(new Error(businessObj.id));
                }
            }
            axiosGet();
        }
        else {
            console.log("Error in extensionsElement in IoT start");
            workerpool.workerEmit({status: "Error in extensionsElement in IoT start"});
            reject(new Error(businessObj.id));
        }
    })
}



const sensorCatchArtefactGroup = (value, id, start_t, timeout) => {
    return new Promise((resolve, reject) => {
        console.log("TIMEOUT:" + timeout);

        let eventValue = value.url;
        let name = value.key;
        let mathOp = value.mathOP;
        let mathOpVal = value.value;

        if (eventValue && name && mathOp && mathOpVal) {
            mathOpVal = convertInputToFloatOrKeepType(mathOpVal);
            const axiosGet = () => {
                let noTimeoutOccured =  new Date().getTime() - start_t <= timeout;
                if(!timeout || noTimeoutOccured) {
                    axios.get(eventValue).then((resp) => {
                        let resVal = getResponseByAttributeAccessor(resp.data, name)
                        if (!isNil(resVal)) {
                            switch (mathOp) {
                                case '<' :
                                    if (parseFloat(resVal) < mathOpVal) {
                                        console.log(name + " reached state " + resVal);
                                        workerpool.workerEmit({status: name + " reached state " + resVal});
                                        resolve(resVal);
                                    } else {
                                        console.log("WAIT UNTIL " + name + " with state " + resVal + " reached");
                                        //fillSidebarRightLog("WAIT UNTIL " + name + " with state " + resVal + " reached");
                                        workerpool.workerEmit({status: "WAIT UNTIL " + name + " with state " + resVal + " reached"});
                                        axiosGet();
                                    }
                                    break;
                                case '=' :
                                    mathOpVal = convertInputToBooleanOrKeepType(mathOpVal)
                                    if (resVal === mathOpVal) {
                                        console.log(name + " reached state " + resVal);
                                        workerpool.workerEmit({status: name + " reached state " + resVal});
                                        resolve(resVal);
                                    } else {
                                        console.log("WAIT UNTIL " + name + " with state " + resVal + " reached");
                                        workerpool.workerEmit({status: "WAIT UNTIL " + name + " with state " + resVal + " reached"});
                                        axiosGet();
                                    }
                                    break;
                                case '>' :
                                    if (parseFloat(resVal) > mathOpVal) {
                                        console.log(name + " reached state " + resVal);
                                        workerpool.workerEmit({status: name + " reached state " + resVal});
                                        resolve(resVal);
                                    } else {
                                        console.log("WAIT UNTIL " + name + " with state " + resVal + " reached");
                                        workerpool.workerEmit({status: "WAIT UNTIL " + name + " with state " + resVal + " reached"});
                                        axiosGet();
                                    }
                                    break;
                                default:
                                    console.log("Default case stopped IoT start");
                                    workerpool.workerEmit({status: "Default case stopped IoT start"});
                                    reject(new Error(id));
                            }
                        } else {
                            console.log("Key not in response - IoT start");
                            workerpool.workerEmit({status: "Key not in response - IoT start"});
                        }
                    }).catch((e) => {
                        console.log(e);
                        console.log("Recursion axios error in input");
                        workerpool.workerEmit({status: "Recursion axios error in input: " + e});
                        reject(new Error(id));
                    });
                } else {
                    workerpool.workerEmit({status: "Timeout occurred"});
                    reject(new Error(id));
                }
            }
            axiosGet();
        }
        else {
            console.log("Error in extensionsElement in IoT start");
            workerpool.workerEmit({status: "Error in extensionsElement in IoT start"});
            reject(new Error(id));
        }
    })
}



// create a worker and register public functions
workerpool.worker({
    sensorCatchArtefact: sensorCatchArtefact,
    sensorCall: sensorCall,
    sensorCallGroup: sensorCallGroup,
    actorCall: actorCall,
    actorCallGroup: actorCallGroup,
    sensorCatchArtefactGroup: sensorCatchArtefactGroup
});
