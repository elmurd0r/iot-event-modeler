import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer';
import {is, getBusinessObject} from 'bpmn-js/lib/util/ModelUtil';
const {EventEmitter} = require('events');
const {Engine} = require('bpmn-engine');
const axios = require('axios').default;
const workerpool = require('workerpool');

import {confirmIcon, errIcon} from "../svg/Icons";
import customModule from '../custom/executer';
import iotExtension from '../../resources/iot.json';
import camundaExtension from '../../resources/camunda.json';
import { isNil } from 'min-dash';

const processModel = sessionStorage.getItem('xml') ? sessionStorage.getItem('xml') : '';
const containerEl = document.getElementById('js-canvas');
const runBtn = document.getElementById('runBtn');
import {Timers} from "./Timer";
import {TreeNode} from "./TreeNode";
import {
  convertInputToBooleanOrKeepType,
  convertInputToFloatOrKeepType,
  getResponseByAttributeAccessor
} from "./ExecuteHelper";
import Color from "../custom/helper/Color";

let start_t;
let end_t;
let executedTasksArr = [];
const pool = workerpool.pool('/worker.js');
let timeout;

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


//Engine stuff
const listener = new EventEmitter();

const engine = Engine({
  name: 'process model execution',
  source: processModel,
  timers: Timers(),
  moddleOptions: {
    iot: iotExtension,
    camunda: camundaExtension
  }
});

listener.on('activity.timer', (api, execution) => {
  timeout = api.content.timeout;
  console.log(api.content.startedAt + api.content.timeout);
});

listener.on('activity.timeout', (api, execution) => {
  // Hier kommen wir rein, wenn die Boundary-Event-Zeit abläuft
  //pool.terminate({force:true});
  console.log("Tjah pech");
});

listener.on('activity.start', (start) => {
  start_t = new Date().getTime();

  console.log("=-=-=-=-=-=-=-=");
  console.log(start.id);
  fillSidebarRightLog("=-=-=-=-=-=-=-=");
  fillSidebarRightLog(start.id);
});


listener.on('activity.wait', (waitObj) => {
  let sourceId = waitObj.content.inbound;

  let taskArr = bpmnViewer.get('elementRegistry').filter(element => is(element, "bpmn:Task"));
  let startEventArr = bpmnViewer.get('elementRegistry').filter(element => is(element, "bpmn:StartEvent"));
  let catchEventArr = bpmnViewer.get('elementRegistry').filter(element => is(element, "bpmn:IntermediateCatchEvent"));
  let boundaryEventArr = bpmnViewer.get('elementRegistry').filter(element => is(element, "bpmn:BoundaryEvent"));
  let boundaryEvent = boundaryEventArr.filter(boundaryEvent => boundaryEvent.businessObject.attachedToRef.id === waitObj.id);
  let boundaryEventType = boundaryEvent? boundaryEvent.map(event => event.businessObject.eventDefinitions[0]['$type']) : [];

  let startEvent = startEventArr.find(startEvent => startEvent.id === waitObj.id);
  let catchEvent = catchEventArr.find(catchEvent => catchEvent.id === waitObj.id && catchEvent?.businessObject.type === 'catch');
  let throwEvent = catchEventArr.find(throwEvent => throwEvent.id === waitObj.id && throwEvent?.businessObject.type === 'throw');
  let task = taskArr.find(task => task.id === waitObj.id);

  if(startEvent || catchEvent) {
    let event = startEvent ? startEvent : catchEvent;
    highlightElement(event, Color.orange);
    const mathLoopCall = (businessObj, eventValue) => {
      let extensionElements = businessObj.get("extensionElements")?.values;
      let iotProperties = extensionElements.filter(element => element['$type'] === 'iot:Properties')[0].values[0];

      let name = iotProperties.key;
      let mathOp = iotProperties.mathOP;
      let mathOpVal = iotProperties.value;
      let timeout = iotProperties.timeout;

      if (name && mathOp && mathOpVal && mathOpVal) {
        mathOpVal = convertInputToFloatOrKeepType(mathOpVal);
        const axiosGet = () => {
          let noTimeoutOccured =  new Date().getTime() - start_t <= timeout * 1000;
          if(!timeout || noTimeoutOccured) {
            axios.get(eventValue).then((resp) => {
              let resVal = getResponseByAttributeAccessor(resp.data, name);
              if (!isNil(resVal)) {
                switch (mathOp) {
                  case '<' :
                    if (parseFloat(resVal) < mathOpVal) {
                      console.log(name + " reached state " + resVal);
                      fillSidebarRightLog(name + " reached state " + resVal);
                      waitObj.signal();
                    } else {
                      console.log("WAIT UNTIL " + name + " with state " + resVal + " reached");
                      fillSidebarRightLog("WAIT UNTIL " + name + " with state " + resVal + " reached");
                      axiosGet();
                    }
                    break;
                  case '=' :
                    mathOpVal = convertInputToBooleanOrKeepType(mathOpVal)
                    if (resVal === mathOpVal) {
                      console.log(name + " reached state " + resVal);
                      fillSidebarRightLog(name + " reached state " + resVal);
                      waitObj.signal();
                    } else {
                      console.log("WAIT UNTIL " + name + " with state " + resVal + " reached");
                      fillSidebarRightLog("WAIT UNTIL " + name + " with state " + resVal + " reached");
                      axiosGet();
                    }
                    break;
                  case '>' :
                    if (parseFloat(resVal) > mathOpVal) {
                      console.log(name + " reached state " + resVal);
                      fillSidebarRightLog(name + " reached state " + resVal);
                      waitObj.signal();
                    } else {
                      console.log("WAIT UNTIL " + name + " with state " + resVal + " reached");
                      fillSidebarRightLog("WAIT UNTIL " + name + " with state " + resVal + " reached");
                      axiosGet();
                    }
                    break;
                  default:
                    console.log("Default case stopped IoT start");
                    fillSidebarRightLog("Default case stopped IoT start");
                    engine.stop();
                }
              } else {
                console.log("Key not in response - IoT start");
                fillSidebarRightLog("Key not in response - IoT start");
              }
            }).catch((e) => {
              console.log(e);
              console.log("Recursion axios error in input");
              fillSidebarRightLog("Recursion axios error in input: " + e);
              highlightErrorElements(null, waitObj, "Not executed", e, "-", boundaryEventType);
            });
          } else {
            fillSidebarRightLog("Timeout occurred");
            highlightErrorElements(null, waitObj, "Not executed", "event/start timeout", "-", boundaryEventType);
          }
        }
        axiosGet();
      } else {
        console.log("Error in extensionsElement in IoT start");
        fillSidebarRightLog("Error in extensionsElement in IoT start");
        highlightErrorElements(null, waitObj, "Not executed", "start extensionElement", '-', boundaryEventType);
      }
    }

    let businessObj = getBusinessObject(event);
    let eventValUrl = businessObj.get("extensionElements")?.values.filter(element => element['$type'] === 'iot:Properties')[0].values[0].url;
    //let Link = businessObj.get("extensionElements")?.values.filter(element => element['$type'] === 'iot:Properties')[0].values[0].url;

    if(businessObj.type) {
      if(eventValUrl) {
        mathLoopCall(businessObj, eventValUrl);
      }
      else {
        console.log("No iot start URL value defined");
        fillSidebarRightLog("No iot start URL value defined");
        engine.stop();
      }
    } else {
      waitObj.signal();
    }
  }

  if(throwEvent) {
    highlightElement(throwEvent, Color.orange);
    let businessObj = getBusinessObject(throwEvent);
    let iotProperties = businessObj.get("extensionElements")?.values.filter(element => element['$type'] === 'iot:Properties')[0].values[0];
    let eventValUrl = iotProperties.url;
    let method = iotProperties.method;
    if(eventValUrl) {
      if(method === 'GET') {
        axios.get( eventValUrl).then((resp)=>{
          console.log("HTTP GET successfully completed");
          console.log('Executed call: ' + eventValUrl);
          fillSidebarRightLog("HTTP GET successfully completed");
          fillSidebarRightLog('Executed GET: ' + eventValUrl);
          waitObj.signal();
        }).catch((e)=>{
          console.log(e);
          console.log("HTTP GET FAILED!! - DataOutputAssociation ACTOR");
          fillSidebarRightLog("HTTP GET FAILED!! - DataOutputAssociation ACTOR: "+e);
          highlightErrorElements(null, waitObj, "Not executed" , e, sourceId[0].sourceId,boundaryEventType);
        });
      } else {
        axios.post( eventValUrl, {}, { headers: {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'}}).then((resp)=>{
          console.log("HTTP POST successfully completed");
          console.log('Executed call: ' + eventValUrl);
          fillSidebarRightLog("HTTP POST successfully completed");
          fillSidebarRightLog('Executed call: ' + eventValUrl);
          waitObj.signal();
        }).catch((e)=>{
          console.log(e);
          console.log("HTTP POST FAILED!! - DataOutputAssociation ACTOR");
          fillSidebarRightLog("HTTP POST FAILED!! - DataOutputAssociation ACTOR: "+e);
          highlightErrorElements(null, waitObj, "Not executed" , e, sourceId[0].sourceId,boundaryEventType);
        });
      }
    } else {
      console.log("Error in extensionsElement in IoT intermediate actor event");
      fillSidebarRightLog("Error in extensionsElement in IoT intermediate actor event");
      highlightErrorElements(null, waitObj, "Not executed" , "extensionElement", sourceId[0].sourceId, boundaryEventType);
    }
  }

  const extractedInputs = (iotInputs, workerArr) => {
    iotInputs.forEach(input => {
      highlightElement(input, Color.orange);
      let businessObj = getBusinessObject(input);

      if (businessObj.type === 'sensor') {
        workerArr.push(
            pool.exec('sensorCall', [businessObj], {
              on: payload => {
                fillSidebarRightLog(payload.status);
              }
            }).then(result => {
              console.log("Result:");
              console.log(result);
              if (result.value) {
                waitObj.environment.variables[input.id] = result.value;
              }
              highlightElement(input, Color.green_low_opacity);
              return result;
            }).catch(e => {
              console.log(e);
              highlightErrorElements(input, waitObj, "Not executed", e, "-", boundaryEventType);
              throw e;
            })
        )
      }
      if (businessObj.type === 'sensor-sub') {
        let execArray = [];
        waitObj.environment.variables[input.id] = {};
        let values = businessObj.extensionElements?.values.filter(element => element['$type'] === 'iot:Properties')[0].values;
        values.forEach(value => {
          if (value.url && value.key && value.name) {
            let execElement = pool.exec('sensorCallGroup', [value.url, value.key, businessObj.id], {
              on: payload => {
                fillSidebarRightLog(payload.status);
              }
            }).then(result => {
              console.log("Result:");
              console.log(result);
              if (result.value) {
                waitObj.environment.variables[input.id] = {...waitObj.environment.variables[input.id], [value.name] : result.value };
              }
              highlightElement(input, Color.green_low_opacity);
              return result;
            }).catch(e => {
              console.log(e);
              highlightErrorElements(input, waitObj, "Not executed", e, "-", boundaryEventType);
              throw e;
            })
            execArray.push(execElement);
            workerArr.push(execElement)
          } else {
            console.log("SensorGroup: Key or URL incorrect / doesn't exist");
          }
        })
        Promise.allSettled(execArray).then((values) => {
          let rejected = values.filter(val => val.status === 'rejected');
          if (rejected.length === 0) {
            highlightElement(input, Color.green_low_opacity);
          } else {
            highlightErrorElements(input, waitObj, "Not executed", "ActorGroup error", "-", boundaryEventType);
          }
        });
      }
      if(businessObj.type === 'artefact-catch') {
        highlightElement(input, Color.orange)
        workerArr.push(
            pool.exec('sensorCatchArtefact', [businessObj, start_t, timeout], {
              on: payload => {
                fillSidebarRightLog(payload.status);
              }
            }).then(result => {
              console.log("Result:");
              console.log(result);
              if (result.value) {
                waitObj.environment.variables[input.id] = result.value;
              }
              highlightElement(input, Color.green_low_opacity);
              return result;
            }).catch(e => {
              console.log(e);
              highlightErrorElements(input, waitObj, "Not executed", e, "-", boundaryEventType);
              throw e;
            })
        )

      }
      if(businessObj.type === 'artefact-catch-sub') {
        let execArray = [];
        let values = businessObj.extensionElements?.values.filter(element => element['$type'] === 'iot:Properties')[0].values;
        values.forEach(value => {
          if (value.url && value.key && value.name) {
            let execElement = pool.exec('sensorCatchArtefactGroup', [value, businessObj.id, start_t, timeout], {
              on: payload => {
                fillSidebarRightLog(payload.status);
              }
            }).then(result => {
              console.log("Result:");
              console.log(result);
              if (result) {
                waitObj.environment.variables[input.id] = {...waitObj.environment.variables[input.id], [value.name] : result };
              }
              return result;
            }).catch(e => {
              console.log(e);
              throw e;
            })
            execArray.push(execElement);
            workerArr.push(execElement)
          } else {
            console.log("SensorGroup: Key or URL incorrect / doesn't exist");
          }
        })
        Promise.allSettled(execArray).then((values) => {
          let rejected = values.filter(val => val.status === 'rejected');
          if (rejected.length === 0) {
            highlightElement(input, Color.green_low_opacity);
          } else {
            highlightErrorElements(input, waitObj, "Not executed", "Sensor Catch Artefact Group error", "-", boundaryEventType);
          }
        });

      }
    })
  }

  const extractedOutputs = (iotOutputs, workerArr) => {
    iotOutputs.forEach(output => {
      highlightElement(output, Color.orange);
      let businessObj = getBusinessObject(output);

      if (businessObj.type === 'actor') {
        workerArr.push(
            pool.exec('actorCall', [businessObj], {
              on: payload => {
                fillSidebarRightLog(payload.status);
              }
            }).then(result => {
              console.log("Result:");
              console.log(result);
              highlightElement(output, Color.green_low_opacity);
              return result;
            }).catch(e => {
              highlightErrorElements(output, waitObj, "Not executed", e, "-", boundaryEventType);
              console.log(e);
              throw e;
            })
        )
      }
      if (businessObj.type === 'actor-sub') {
        let execArray = [];
        let values = businessObj.extensionElements?.values.filter(element => element['$type'] === 'iot:Properties')[0].values;
        values.forEach(value => {
          let execElement = pool.exec('actorCallGroup', [value.url, value.method, businessObj.id], {
            on: payload => {
              fillSidebarRightLog(payload.status);
            }
          }).then(result => {
            console.log("Result:");
            console.log(result);
            return result;
          }).catch(e => {
            console.log(e);
            throw e;
          })
          execArray.push(execElement);
          workerArr.push(execElement);
        })
        Promise.allSettled(execArray).then((values) => {
          let rejected = values.filter(val => val.status === 'rejected');
          if (rejected.length === 0) {
            highlightElement(output, Color.green_low_opacity);
          } else {
            highlightErrorElements(output, waitObj, "Not executed", "ActorGroup error", "-", boundaryEventType);
          }
        });
      }
      //TODO: handle obj the right way. Currently it acts as an actor
      if (businessObj.type === 'obj') {
        workerArr.push(
            pool.exec('actorCall', [businessObj], {
              on: payload => {
                fillSidebarRightLog(payload.status);
              }
            }).then(result => {
              console.log("Result:");
              console.log(result);
              highlightElement(output, Color.green_low_opacity);
              return result;
            }).catch(e => {
              highlightErrorElements(output, waitObj, "Not executed", e, "-", boundaryEventType);
              console.log(e);
              throw e;
            })
        )
      }
    })
  }

  const extractedDecision = (iotInputs, workerArr, currentDecisionID) => {
    iotInputs.forEach(input => {
      let businessObj = getBusinessObject(input);

      if (businessObj.type === 'sensor') {
        workerArr.push(
            pool.exec('sensorCall', [businessObj], {
              on: payload => {
                fillSidebarRightLog(payload.status);
              }
            }).then(result => {
              console.log("Result:");
              console.log(result);
              if (result.value) {
                waitObj.environment.variables[currentDecisionID] = {...waitObj.environment.variables[currentDecisionID], [input.id] : result.value };
              }
              highlightElement(input, Color.green_low_opacity);
              //return result;
            }).catch(e => {
              console.log(e);
              highlightErrorElements(input, waitObj, "Not executed", e, "-", boundaryEventType);
              throw e;
            })
        )
      }
      if (businessObj.type === 'sensor-sub') {
        let execArray = [];
        waitObj.environment.variables[currentDecisionID] = {};
        let values = businessObj.extensionElements?.values.filter(element => element['$type'] === 'iot:Properties')[0].values;
        values.forEach(value => {
          if (value.url && value.key && value.name) {
            let execElement = pool.exec('sensorCallGroup', [value.url, value.key, businessObj.id], {
              on: payload => {
                fillSidebarRightLog(payload.status);
              }
            }).then(result => {
              console.log("Result:");
              console.log(result);
              if (result.value) {
                waitObj.environment.variables[input.id] = {...waitObj.environment.variables[input.id], [value.name] : result.value };
              }
              highlightElement(input, Color.green_low_opacity);
              return result;
            }).catch(e => {
              console.log(e);
              highlightErrorElements(input, waitObj, "Not executed", e, "-", boundaryEventType);
              throw e;
            })
            execArray.push(execElement);
            workerArr.push(execElement);
          } else {
            console.log("SensorGroup: Key or URL incorrect / doesn't exist");
          }
        })
        Promise.allSettled(execArray).then((values) => {
          let rejected = values.filter(val => val.status === 'rejected');
          if (rejected.length === 0) {
            highlightElement(input, Color.green_low_opacity);
          } else {
            highlightErrorElements(input, waitObj, "Not executed", "ActorGroup error", "-", boundaryEventType);
          }
        });
      }
    })
  }

  const extractedPromise = (workerArr) => {
    Promise.allSettled(workerArr).then((values) => {
      console.log(values);
      let rejected = values.filter(val => val.status === 'rejected');
      if (rejected.length === 0) {
        waitObj.signal();
      }
    }).catch((e) => console.log(e));
  }

  const evalDecision = (currentShape) => {
    let values = currentShape.businessObject.extensionElements?.values.filter(element => element['$type'] === 'iot:Properties')[0].values;
    values.forEach(value => {
      if (value.name && value.condition) {
        let regex = /[a-zA-Z0-9_\-]*[.][a-zA-Z0-9_\-]*/gm;
        let stringForRegex = value.condition;
        let parsedVariableArray = stringForRegex.match(regex);
        let replacedArray = parsedVariableArray.map((str) => {
          let partElement = "";
          let keyArr = str.split('.');
          keyArr.forEach(k => {
            partElement += "['"+k+"']";
          });
          return "waitObj['environment']['variables']"+partElement;
        })

        replacedArray.forEach((match, groupIndex) => {
          stringForRegex = stringForRegex.replace( /[a-zA-Z0-9_\-]*[.][a-zA-Z0-9_\-]*/, match);
        })
        waitObj.environment.variables[currentShape.id] = {...waitObj.environment.variables[currentShape.id], [value.name] : eval(stringForRegex) };
      }
    })
    console.log(waitObj.environment.variables)
    return waitObj.environment.variables[currentShape.id];
  }

  const getTreeResult = (treeNode) => {
    let childrenPromises = [];
    const workerArrDecision = [];

    const extractedDecisionSeatteldPromise = () => {
      return Promise.allSettled(workerArrDecision).then((values) => {
        let rejected = values.filter(val => val.status === 'rejected');
        if (rejected.length === 0) {
          //successful
          let decisionResult = evalDecision(treeNode.value);
          addOverlaysDecision(treeNode.value, decisionResult);
          addOverlaysResult(treeNode.value, decisionResult);
          highlightElement(treeNode.value, Color.green_full_opacity);
          return new Promise(resolve => resolve("succsess"));
        } else {
          //fail
          highlightErrorElements(treeNode.value, waitObj, "Not executed", "error", "-", []);
          return new Promise((resolve, reject) => reject(new Error(id)));
        }
      })
    }

    let iotInputs = treeNode.value.children.map(input => {
      if (input.businessObject.type === 'sensor' || input.businessObject.type === 'sensor-sub') {
        return bpmnViewer.get('elementRegistry').find(element => element.id === input.id);
      }
    }).filter(e => e !== undefined);
    console.log(iotInputs);


    if(treeNode.descendants.length > 0) {
      treeNode.descendants.forEach(x => {
        childrenPromises.push(getTreeResult(x));
      })
      return Promise.allSettled(childrenPromises).then((values) => {
        let rejected = values.filter(val => val.status === 'rejected');

        if (rejected.length === 0) {
          highlightElement(treeNode.value, Color.orange);
          extractedDecision(iotInputs, workerArrDecision, treeNode.value.id);
          return extractedDecisionSeatteldPromise();
        } else {
          //fail
          console.log("FAIL");
          highlightElement(treeNode.value, Color.red);
          rejected.forEach(rej => fillSidebarRightLog("msg: " + rej.reason.message + ", stack: " + rej.reason.stack))
          return new Promise((resolve,reject) => reject(new Error(id)));
        }
      });
    } else {
      highlightElement(treeNode.value, Color.orange);
      extractedDecision(iotInputs, workerArrDecision, treeNode.value.id);
    }
    return extractedDecisionSeatteldPromise();
  }


  if(task) {
    const workerArr = [];
    let businessObj = getBusinessObject(task);

    let iotDecisionGroup = businessObj.get("dataInputAssociations")?.map(input => {
      if (input.sourceRef[0].type && input.sourceRef[0].type === 'decision-group') {
        return bpmnViewer.get('elementRegistry').find(element => element.id === input.sourceRef[0].id);
      }
    }).filter(e => e !== undefined);
    let iotInputs = businessObj.get("dataInputAssociations")?.map(input => {
      if (input.sourceRef[0].type && input.sourceRef[0].type !== 'decision-group') {
        return bpmnViewer.get('elementRegistry').find(element => element.id === input.sourceRef[0].id);
      }
    }).filter(e => e !== undefined);
    let iotOutputs = businessObj.get("dataOutputAssociations")?.map(input => {
      if(input.targetRef.type) {
        return bpmnViewer.get('elementRegistry').find(element => element.id === input.targetRef.id);
      }
    }).filter(e => e !== undefined);

    if(iotDecisionGroup.length > 0) {
      highlightElement(task, Color.orange);
      let x = createTree(iotDecisionGroup[0]);
      //console.log(x);

      getTreeResult(x).then((val) => {
        waitObj.signal();
      }).catch(xy => {
        engine.stop();
      });
    }

    if(iotInputs.length === 0 && iotOutputs.length === 0 && iotDecisionGroup.length === 0){
      waitObj.signal();
    } else {
      highlightElement(task, Color.orange);
    }
    if(iotInputs.length > 0 && iotOutputs.length === 0) {
      // run registered functions on the worker via exec
      extractedInputs(iotInputs, workerArr);
      extractedPromise(workerArr);
    }

    if(iotOutputs.length > 0 && iotInputs.length === 0) {
      extractedOutputs(iotOutputs, workerArr);
      extractedPromise(workerArr);
    }

    if (iotOutputs.length > 0 && iotInputs.length > 0) {
      extractedInputs(iotInputs, workerArr);
      extractedOutputs(iotOutputs, workerArr);
      extractedPromise(workerArr);
    }
  }
})

const createTree = (shape) => {
  let mainNode = new TreeNode(shape);

  if(shape.children.length > 0) {
    shape.children.forEach(childNode => {
      if(childNode.type === 'bpmn:SubProcess') {
        mainNode.descendants.push(createTree(childNode));
      }
    })
  }
  return mainNode;
}

listener.on('activity.end', (element)=>{
  end_t = new Date().getTime();
  let time = end_t - start_t;

  console.log("EXECUTION TIME: "+ time);
  fillSidebarRightLog("EXECUTION TIME: " + time + " ms");


  let currentElement = bpmnViewer.get('elementRegistry').find((elem)=>elem.id === element.id);
  let businessObj = getBusinessObject(currentElement) ? getBusinessObject(currentElement) : null;
  let timeStamp = timestampToDate(element.messageProperties.timestamp);
  let obj = element.content.inbound;

  if(businessObj?.type === 'end') {
    highlightElement(currentElement, Color.orange);
    const workerArr = [];
    workerArr.push(
      pool.exec('actorCall', [businessObj], {
        on: payload => {
          fillSidebarRightLog(payload.status);
        }
      }).then(result => {
        let end_t_1 = new Date().getTime();
        let _time = end_t_1 - start_t;
        console.log("Result:");
        console.log(result);
        highlightElement(currentElement, Color.green_low_opacity);
        addOverlays(currentElement, _time);
        fillSidebar(confirmIcon, element.name, element.id, _time, timeStamp, 'bpmn:IoTEndEvent', "-", obj ? obj[0].sourceId : '-');
        return result;
      }).catch(e => {
        let end_t_1 = new Date().getTime();
        let _time = end_t_1 - start_t;
        highlightErrorElements(null, element, "Not executed", e, "-", []);
        addOverlays(currentElement, _time);
        console.log(e);
        throw e;
      })
    )
  } else {
    if(businessObj?.type !== 'decision-group') {
      highlightElement(currentElement, Color.green_low_opacity);
      addOverlays(currentElement, time);
      fillSidebar(confirmIcon, element.name, element.id, time, timeStamp, element.type, "-", obj ? obj[0].sourceId : '-');
    }
  }

  // -----------------
  executedTasksArr.push(element.id);

  let taskArr = bpmnViewer.get('elementRegistry').filter(element => is(element, "bpmn:Task"));
  let task = taskArr.find(task => task.id === element.id);
  if(task) {
    let businessObj = getBusinessObject(task);
    let iotInputs = businessObj.get("dataInputAssociations")?.map(input => {
      if (input.sourceRef[0].type) {
        let elementToColor = bpmnViewer.get('elementRegistry').find(element => element.id === input.sourceRef[0].id);
        highlightElement(elementToColor, Color.green_full_opacity);
        return input.sourceRef[0].id;
      }
    });
    let iotOutputs = businessObj.get("dataOutputAssociations")?.map(input => {
      if(input.targetRef.type) {
        let elementToColor = bpmnViewer.get('elementRegistry').find(element => element.id === input.targetRef.id);
        highlightElement(elementToColor, Color.green_full_opacity);
        return input.targetRef.id;
      }
    });
    executedTasksArr.push(...iotInputs);
    executedTasksArr.push(...iotOutputs);
  }
})

const throwError = (api, id, msg) => {
  // Code um einen Boundary-Error zu "thrown"
  //api.owner.emitFatal({id: 'SomeId', message: 'thrown in wait'}, {id: waitObj.id});
  api.owner.emitFatal({id: id, message: msg}, {id: api.id});
}

const highlightErrorElements = (iotArtifact, waitObj, time, errormsg, source, boundary) => {
  if(boundary.length === 0) {
    engine.stop();
  }

  let element = bpmnViewer.get('elementRegistry').find(e => e.id === waitObj.id);

  if(iotArtifact) {
    let iotArtifactElement = bpmnViewer.get('elementRegistry').find(e => e.id === iotArtifact.id);
    highlightElement(iotArtifactElement, Color.red);
  }
  highlightElement(element, Color.red);
  let convertedTimeStamp = timestampToDate(waitObj.messageProperties.timestamp);
  fillSidebar(errIcon, waitObj.name, waitObj.id, time, convertedTimeStamp, waitObj.type, errormsg, source);
}

const timestampToDate = (timestamp) => {
  let date = new Date(timestamp);
  let convertTimestamp = date.getDate()+
      "/"+(date.getMonth()+1)+
      "/"+date.getFullYear()+
      " "+date.getHours()+
      ":"+(date.getMinutes()<10?'0':'') + date.getMinutes();

  return convertTimestamp;
}

function fillSidebarRightLog(msg) {
  let table = document.getElementById("overlayTableLogRight").getElementsByTagName("tbody")[0];
  let tableLength = table.rows.length;
  let row;
  if(tableLength > 100) {
    table.deleteRow(0);
    row = table.insertRow(tableLength -1);
  } else {
    row = table.insertRow(tableLength);
  }

  let text = row.insertCell(0);
  text.innerHTML = msg;

  scrollLogToBottom();
}

const scrollLogToBottom = () => {
  let div = document.getElementById("logDiv");
  div.scrollTop = div.scrollHeight - div.clientHeight;
}


function fillSidebar(state, name, id, time, timeStamp,type, errormsg, source) {
  let table = document.getElementById("overlayTable").getElementsByTagName("tbody")[0];
  let tableLength = table.rows.length;
  let row = table.insertRow(tableLength);
  row.classList.add("text-center");

  let stateCell = row.insertCell(0);
  let nameCell = row.insertCell(1);
  let idCell = row.insertCell(2);
  let typeCell = row.insertCell(3);
  let sourceCell = row.insertCell(4);
  let startTimeCell = row.insertCell(5);
  let executionTimeCell = row.insertCell(6);
  let errorMsgCell = row.insertCell(7);


  stateCell.innerHTML = state;
  nameCell.innerHTML = name ? name : '-';
  idCell.innerHTML = id;
  typeCell.innerHTML = type;
  sourceCell.innerHTML = source;
  startTimeCell.innerHTML = timeStamp;
  executionTimeCell.innerHTML = time/1000 + " s";
  errorMsgCell.innerHTML = errormsg;
}

const addOverlaysResult = (elem, states) => {
  let values = elem.businessObject.extensionElements?.values.filter(element => element['$type'] === 'iot:Properties')[0].values;
  let valuesName = values.map(val => val.name);
  let spanStates="";

  for (const [key, value] of Object.entries(states)) {
    if(typeof value == "object") {
      for (const [_key, _value] of Object.entries(value)) {
        spanStates = spanStates + `<li class="list-group-item ${valuesName.includes(_key) ? 'item-active' : ''}">${key + '.' + _key}: ${_value}</li>`;
      }
    } else {
      if(!key.includes("label") && valuesName.includes(key)) {
        let x = values.find(val => val.name === key);
        spanStates = spanStates + `<li class="list-group-item ${valuesName.includes(key) ? (value ? 'item-success' : 'item-error') : ''}">${key}: ${value}</li>`;
      }
    }
  }

  let decisionLog = document.getElementById("decisionLog");
  decisionLog.innerHTML += '<ul id="res-'+elem.id+'" style="display: none" class="ttooltiptext">'+ spanStates + '</ul>';
  let resOverlay = document.createElement('div');
  resOverlay.className = "result-overlay";
  resOverlay.innerText = "Results";

  resOverlay.addEventListener('mouseover', (event)=>{
    console.log(decisionLog.children);
    for (let i = 0; i < decisionLog.children.length; i++) {
      decisionLog.children[i].style.display = "none";
    }
    document.getElementById("res-"+elem.id).style.display = "block";
  });

  resOverlay.addEventListener('mouseleave', (event)=>{
    console.log(decisionLog.children);
    for (let i = 0; i < decisionLog.children.length; i++) {
      decisionLog.children[i].style.display = "none";
    }
  });

  overlays.add(elem, {
    html: resOverlay,
    position: {
      right: 55,
      top: 0
    }
  });
}


const addOverlaysDecision = (elem, states) => {
  let values = elem.businessObject.extensionElements?.values.filter(element => element['$type'] === 'iot:Properties')[0].values;
  let valuesName = values.map(val => val.name);
  let spanStates="";

  for (const [key, value] of Object.entries(states)) {
    if(typeof value == "object") {
      for (const [_key, _value] of Object.entries(value)) {
        spanStates = spanStates + `<li class="list-group-item ${valuesName.includes(_key) ? 'item-active' : ''}">${key + '.' + _key}: ${_value}</li>`;
      }
    } else {
      if(!key.includes("label")) {
        let x = values.find(val => val.name === key);
        spanStates = spanStates + `<li class="list-group-item ${valuesName.includes(key) ? (value ? 'item-success' : 'item-error') : ''}">${x?.condition ? x.condition + '<b> => </b>' : ''}  ${key}: ${value}</li>`;
      }
    }
  }

  let decisionLog = document.getElementById("decisionLog");
  decisionLog.innerHTML += '<ul id="dec-'+elem.id+'" style="display: none" class="ttooltiptext">'+ spanStates + '</ul>';
  let decOverlay = document.createElement('div');
  decOverlay.className = "decision-overlay";
  decOverlay.innerText = "Decision";

  decOverlay.addEventListener('mouseover', (event)=>{
    console.log(decisionLog.children);
    for (let i = 0; i < decisionLog.children.length; i++) {
      decisionLog.children[i].style.display = "none";
    }
    document.getElementById("dec-"+elem.id).style.display = "block";
  });

  decOverlay.addEventListener('mouseleave', (event)=>{
    console.log(decisionLog.children);
    for (let i = 0; i < decisionLog.children.length; i++) {
      decisionLog.children[i].style.display = "none";
    }
  });

  overlays.add(elem, {
    html: decOverlay,
    position: {
      left: 0,
      top:0
    }
  });
};

const addOverlays = (elem, time) => {
  overlays.add(elem, {
    html: '<div class="overlay">Time:'+ time/1000+' s</div>',
    position: {
      left: 0,
      top:0
    }
  });
};

const highlightElement = (elem, colorStr) => {
  elem.businessObject.di.set("fill", colorStr);
  const gfx = bpmnViewer.get("elementRegistry").getGraphics(elem);
  const type = elem.waypoints ? "connection" : "shape";
  bpmnViewer.get("graphicsFactory").update(type, elem, gfx);
};

const highlightElementArr = (elementArr, colorStr) => {
  elementArr.forEach((elem)=>highlightElement(elem, colorStr));
}

const resetView = () => {
  // clear executed task array
  executedTasksArr.length = 0;
  // Alle BPMN Elemente aus der elementRegistry holen
  let allElements = bpmnViewer.get('elementRegistry').filter((elem)=>elem.id);
  overlays.clear()
  // Schleife um alle BPMN Elemente wieder mit der Standardfarbe zu färben
  highlightElementArr(allElements, Color.white)

  document.getElementById("tableBody").innerHTML = "";
  document.getElementById("tableBodyLogRight").innerHTML = "";
}

runBtn.addEventListener('click', (event)=>{
  document.getElementById("mySidebarLog").style.display = "block";
  resetView();

  engine.execute({listener}).catch(e=>console.log(e));
})


document.getElementById('openbtn').addEventListener('click', (event)=>{
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("mySidebarLog").style.display = "none";
})

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
document.getElementById('closebtn').addEventListener('click', (event)=>{
  document.getElementById("mySidebar").style.display = "none";
})

document.getElementById('closebtnRight').addEventListener('click', (event)=>{
  document.getElementById("mySidebarLog").style.display = "none";
})
