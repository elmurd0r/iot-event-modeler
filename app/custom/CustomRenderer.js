import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
const svg64 = require('svg64');

import startSVG from "../svg/NewStartSVG.svg";
import actorSVG from "../svg/Artefakt_Empfangend.svg";
import actorSubSVG from "../svg/Artefakt_Empfangend_Sub.svg";
import sensorSVG from "../svg/Artefakt_Sendend.svg";
import sensorSubSVG from "../svg/Artefakt_Senden_Sub.svg";
import artefaktObjSVG from "../svg/Artefakt_Allgemein.svg";

//Base 64 encode SVG files
let startSVGEncoded = svg64(startSVG);
let actorSVGEncoded = svg64(actorSVG);
let actorSubSVGEncoded = svg64(actorSubSVG);
let sensorSVGEncoded = svg64(sensorSVG);
let sensorSubSVGEncoded = svg64(sensorSubSVG);
let artefaktObjSVGEncoded = svg64(artefaktObjSVG);


import {
  remove as svgRemove,
  attr as svgAttr,
  create as svgCreate
} from 'tiny-svg';

import {
  getRoundRectPath
} from 'bpmn-js/lib/draw/BpmnRenderUtil';

import {
  is,
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import { isNil } from 'min-dash';

const HIGH_PRIORITY = 1500,
      TASK_BORDER_RADIUS = 2;


export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY);

    this.bpmnRenderer = bpmnRenderer;
  }

  canRender(element) {
    // ignore labels
    return !element.labelTarget;
  }

  drawShape(parentNode, element) {
    const shape = this.bpmnRenderer.drawShape(parentNode, element);
    const iotType = this.getIotType(element);

    if (!isNil(iotType)) {

      let imageHref;
      switch (iotType) {
        case 'start':
          imageHref = startSVGEncoded;
          break;
        case 'actor':
          imageHref = actorSVGEncoded;
          break;
        case 'actor-sub':
          imageHref = actorSubSVGEncoded;
          break;
        case 'obj':
          imageHref = artefaktObjSVGEncoded;
          break;
        case 'sensor-sub':
          imageHref = sensorSubSVGEncoded;
          break;
        case 'sensor':
        default:
          imageHref = sensorSVGEncoded;
      }

      //const img = drawIot(parentNode, 36, 52, imageHref);
      const img = drawImg(parentNode, element.width, element.height, imageHref);

      prependTo(img, parentNode);
      svgRemove(shape);
      return shape;
    }

    return shape;
  }

  getIotType(element) {
    const businessObject = getBusinessObject(element);

    const type = businessObject.get('iot:type');

    return type ? type : null;
  }

  getShapePath(shape) {
    if (is(shape, 'bpmn:DataObjectReference')) {
      return getRoundRectPath(shape, TASK_BORDER_RADIUS);
    }

    return this.bpmnRenderer.getShapePath(shape);
  }
}

CustomRenderer.$inject = [ 'eventBus', 'bpmnRenderer' ];

// helpers //////////

function drawIot(parentNode, width, height, image) {
    const img = svgCreate(image);

    svgAttr(img, {
      width: width,
      height: height
    });

    return img;
}
function prependTo(newNode, parentNode, siblingNode) {
  parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild);
}

function drawImg(parentNode, width, height, image) {
  const img = svgCreate('image');

  svgAttr(img, {
    width: width,
    height: height,
    strokeWidth: 2,
    href: image
  });

  return img;
}
