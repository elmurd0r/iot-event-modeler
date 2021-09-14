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

  let startEvent = startEventArr.find(startEvent => startEvent.id === waitObj.id);
  let catchEvent = catchEventArr.find(catchEvent => catchEvent.id === waitObj.id && catchEvent?.businessObject.type === 'catch');
  let throwEvent = catchEventArr.find(throwEvent => throwEvent.id === waitObj.id && throwEvent?.businessObject.type === 'throw');
  let task = taskArr.find(task => task.id === waitObj.id);

  if(startEvent || catchEvent) {
    let event = startEvent ? startEvent : catchEvent;
    const mathLoopCall = (businessObj, eventValue) => {
      let name = businessObj.get("extensionElements")?.values[0]?.values?.find(elem => elem.name === 'key')?.value;
      let mathOp = businessObj.get("extensionElements")?.values[0]?.values?.find(s => s.name === ">" || s.name === "<" || s.name === "=")?.name;
      let mathOpVal = businessObj.get("extensionElements")?.values[0]?.values?.find(s => s.name === ">" || s.name === "<" || s.name === "=")?.value;
      let timeout = businessObj.get("extensionElements")?.values[0]?.values?.find(elem => elem.name === 'timeout')?.value;

      if (name && mathOp && mathOpVal && !isNaN(parseFloat(mathOpVal))) {
        mathOpVal = parseFloat(mathOpVal);
        const axiosGet = () => {
          let noTimeoutOccured =  new Date().getTime() - start_t <= timeout * 1000;
          if(!timeout || noTimeoutOccured) {
            axios.get(eventValue, {timeout: 5000}).then((resp) => {
              let resVal = resp.data[name];

              if (!isNil(resVal) && !isNaN(parseFloat(resVal))) {
                resVal = parseFloat(resVal);
                switch (mathOp) {
                  case '<' :
                    if (resVal < mathOpVal) {
                      console.log(name + " reached state " + resp.data[name]);
                      fillSidebarRightLog(name + " reached state " + resp.data[name]);
                      waitObj.signal();
                    } else {
                      console.log("WAIT UNTIL " + name + " with state " + resp.data[name] + " reached");
                      fillSidebarRightLog("WAIT UNTIL " + name + " with state " + resp.data[name] + " reached");
                      axiosGet();
                    }
                    break;
                  case '=' :
                    if (resVal === mathOpVal) {
                      console.log(name + " reached state " + resp.data[name]);
                      fillSidebarRightLog(name + " reached state " + resp.data[name]);
                      waitObj.signal();
                    } else {
                      console.log("WAIT UNTIL " + name + " with state " + resp.data[name] + " reached");
                      fillSidebarRightLog("WAIT UNTIL " + name + " with state " + resp.data[name] + " reached");
                      axiosGet();
                    }
                    break;
                  case '>' :
                    if (resVal > mathOpVal) {
                      console.log(name + " reached state " + resp.data[name]);
                      fillSidebarRightLog(name + " reached state " + resp.data[name]);
                      waitObj.signal();
                    } else {
                      console.log("WAIT UNTIL " + name + " with state " + resp.data[name] + " reached");
                      fillSidebarRightLog("WAIT UNTIL " + name + " with state " + resp.data[name] + " reached");
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
              highlightErrorElements(null, waitObj.name, waitObj.id, "Not executed", waitObj.messageProperties.timestamp, waitObj.type, e, "-");
            });
          } else {
            fillSidebarRightLog("Timeout occurred");
            highlightErrorElements(null, waitObj.name, waitObj.id, "Not executed", waitObj.messageProperties.timestamp, waitObj.type, "event/start timeout", "-");
          }
        }
        axiosGet();
      } else {
        console.log("Error in extensionsElement in IoT start");
        fillSidebarRightLog("Error in extensionsElement in IoT start");
        highlightErrorElements(null, waitObj.name, waitObj.id, "Not executed" ,waitObj.messageProperties.timestamp, waitObj.type, "start extensionElement", '-');
      }
    }

    let businessObj = getBusinessObject(event);
    let eventValUrl = businessObj.value;

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
    let businessObj = getBusinessObject(throwEvent);
    let eventValUrl = businessObj.value;

    if(eventValUrl) {
      axios.post( eventValUrl, null, {timeout: 5000, headers: {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'}}).then((resp)=>{
        console.log("HTTP POST successfully completed");
        console.log('Executed call: ' + eventValUrl);
        fillSidebarRightLog("HTTP POST successfully completed");
        fillSidebarRightLog('Executed call: ' + eventValUrl);
        waitObj.signal();
      }).catch((e)=>{
        console.log(e);
        console.log("HTTP POST FAILED!! - DataOutputAssociation ACTOR");
        fillSidebarRightLog("HTTP POST FAILED!! - DataOutputAssociation ACTOR: "+e);
        highlightErrorElements(null, waitObj.name, waitObj.id, "Not executed" , waitObj.messageProperties.timestamp, waitObj.type, e, sourceId[0].sourceId);
      });
    } else {
      console.log("Error in extensionsElement in IoT intermediate actor event");
      fillSidebarRightLog("Error in extensionsElement in IoT intermediate actor event");
      highlightErrorElements(null, waitObj.name, waitObj.id, "Not executed" , waitObj.messageProperties.timestamp, waitObj.type, "extensionElement", sourceId[0].sourceId);
    }
  }

  if(task) {
    const workerArr = [];
    let businessObj = getBusinessObject(task);

    let iotInputs = businessObj.get("dataInputAssociations")?.map(input => {
      if (input.sourceRef[0].type) {
        return  bpmnViewer.get('elementRegistry').find(element => element.id === input.sourceRef[0].id);
        //return input.sourceRef[0];
      }
    }).filter(e => e !== undefined);
    let iotOutputs = businessObj.get("dataOutputAssociations")?.map(input => {
      if(input.targetRef.type) {
        return  bpmnViewer.get('elementRegistry').find(element => element.id === input.targetRef.id);
        //return input.targetRef;
      }
    }).filter(e => e !== undefined);

    if(iotInputs.length === 0 && iotOutputs.length === 0){
      waitObj.signal();
    }

    if(iotInputs.length > 0 && iotOutputs.length === 0) {
      // run registered functions on the worker via exec
      iotInputs.forEach(input => {
        let businessObj = getBusinessObject(input);

        workerArr.push(
            pool.exec('mathLoopCall', [businessObj, start_t, timeout], {
              on: payload => {
                fillSidebarRightLog(payload.status);
              }
            }).then(result => {
              console.log("Result:");
              console.log(result);
              if(result.envName && result.value) {
                waitObj.environment.variables[result.envName] = result.value;
              }
              highlightElement(input, "rgba(66, 180, 21, 0.7)");
              return result;
            }).catch(e => {
              console.log(e);
              highlightErrorElements(input, waitObj.name, waitObj.id, "Not executed", waitObj.messageProperties.timestamp, waitObj.type, e, "-");
              throw e;
            })
        )
      })
      Promise.allSettled(workerArr).then((values)=>{
            console.log(values);
            let rejected = values.filter(val=>val.status === 'rejected');
            if(rejected.length === 0) {
                waitObj.signal();
            }
      }).catch((e)=>console.log(e));
    }

    if(iotOutputs.length > 0 && iotInputs.length === 0) {
      iotOutputs.forEach(output => {
        let businessObj = getBusinessObject(output);

        workerArr.push(
            pool.exec('outputCall', [businessObj], {
              on: payload => {
                fillSidebarRightLog(payload.status);
              }
            }).then(result => {
              console.log("Result:");
              console.log(result);
              highlightElement(output, "rgba(66, 180, 21, 0.7)");
              return result;
            }).catch(e => {
              console.log(e);
              highlightErrorElements(output, waitObj.name, waitObj.id, "Not executed", waitObj.messageProperties.timestamp, waitObj.type, e, "-");
              throw e;
            })
        )
      })
      Promise.allSettled(workerArr).then((values)=>{
        console.log(values);
        let rejected = values.filter(val=>val.status === 'rejected');
        if(rejected.length === 0) {
          waitObj.signal();
        }
      }).catch((e)=>console.log(e));
    }

    if (iotOutputs.length > 0 && iotInputs.length > 0) {
      iotInputs.forEach(input => {
        let businessObj = getBusinessObject(input);

        workerArr.push(
            pool.exec('mathLoopCall', [businessObj, start_t, timeout], {
              on: payload => {
                fillSidebarRightLog(payload.status);
              }
            }).then(result => {
              console.log("Result:");
              console.log(result);
              if(result.envName && result.value) {
                waitObj.environment.variables[result.envName] = result.value;
              }
              highlightElement(input, "rgba(66, 180, 21, 0.7)");
              return result;
            }).catch(e => {
              console.log(e);
              highlightErrorElements(input, waitObj.name, waitObj.id, "Not executed", waitObj.messageProperties.timestamp, waitObj.type, e, "-");
              throw e;
            })
        )
      })
      iotOutputs.forEach(output => {
        let businessObj = getBusinessObject(output);

        workerArr.push(
            pool.exec('outputCall', [businessObj], {
              on: payload => {
                fillSidebarRightLog(payload.status);
              }
            }).then(result => {
              console.log("Result:");
              console.log(result);
              highlightElement(output, "rgba(66, 180, 21, 0.7)");
              return result;
            }).catch(e => {
              console.log(e);
              highlightErrorElements(output, waitObj.name, waitObj.id, "Not executed", waitObj.messageProperties.timestamp, waitObj.type, e, "-");
              throw e;
            })
        )
      })

      Promise.allSettled(workerArr).then((values)=>{
        console.log(values);
        let rejected = values.filter(val=>val.status === 'rejected');
        if(rejected.length === 0) {
          waitObj.signal();
        }
      }).catch((e)=>console.log(e));
    }
  }
})


listener.on('activity.end', (element)=>{
  end_t = new Date().getTime();
  let time = end_t - start_t;

  console.log("EXECUTION TIME: "+ time);
  fillSidebarRightLog("EXECUTION TIME: " + time + " ms");

  let currentElement = bpmnViewer.get('elementRegistry').find((elem)=>elem.id === element.id);
  let timeStamp = timestampToDate(element.messageProperties.timestamp);

  highlightElement(currentElement, "rgba(66, 180, 21, 0.7)");
  addOverlays(currentElement, time);
  // -----------------
  let obj = element.content.inbound;
  fillSidebar(confirmIcon, element.name, element.id, time, timeStamp, element.type, "-", obj ? obj[0].sourceId : '-');

  executedTasksArr.push(element.id);

  let taskArr = bpmnViewer.get('elementRegistry').filter(element => is(element, "bpmn:Task"));
  let task = taskArr.find(task => task.id === element.id);
  if(task) {
    let businessObj = getBusinessObject(task);
    let iotInputs = businessObj.get("dataInputAssociations")?.map(input => {
      if (input.sourceRef[0].type) {
        let elementToColor = bpmnViewer.get('elementRegistry').find(element => element.id === input.sourceRef[0].id);
        highlightElement(elementToColor, "rgba(66, 180, 21, 0.7)");
        return input.sourceRef[0].id;
      }
    });
    let iotOutputs = businessObj.get("dataOutputAssociations")?.map(input => {
      if(input.targetRef.type) {
        let elementToColor = bpmnViewer.get('elementRegistry').find(element => element.id === input.targetRef.id);
        highlightElement(elementToColor, "rgba(66, 180, 21, 0.7)");
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

const highlightErrorElements = (iotArtifact, name, id, time, timeStamp, type, errormsg, source) => {
  engine.stop();

  let element = bpmnViewer.get('elementRegistry').find(e => e.id === id);

  if(iotArtifact) {
    let iotArtifactElement = bpmnViewer.get('elementRegistry').find(e => e.id === iotArtifact.id);
    highlightElement(iotArtifactElement, "rgb(245,61,51)");
  }
  highlightElement(element, "rgb(245,61,51)");
  let convertedTimeStamp = timestampToDate(timeStamp);
  fillSidebar(errIcon, name, id, time, convertedTimeStamp, type, errormsg, source);
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
  highlightElementArr(allElements, "rgba(255,255,255,1.0)")

  document.getElementById("tableBody").innerHTML = "";
  document.getElementById("tableBodyLogRight").innerHTML = "";
}

runBtn.addEventListener('click', (event)=>{
  document.getElementById("mySidebarLog").style.display = "block";
  resetView();

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
  document.getElementById("mySidebarLog").style.display = "none";
})

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
document.getElementById('closebtn').addEventListener('click', (event)=>{
  document.getElementById("mySidebar").style.display = "none";
})

document.getElementById('closebtnRight').addEventListener('click', (event)=>{
  document.getElementById("mySidebarLog").style.display = "none";
})
