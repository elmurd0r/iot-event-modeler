import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import startSVG from "../svg/NewStartSVG.svg";
import actorSVG from "../svg/Artefakt_Empfangend.svg";
import actorSubSVG from "../svg/Artefakt_Empfangend_Sub.svg";
import sensorSVG from "../svg/Artefakt_Sendend.svg";
import sensorSubSVG from "../svg/Artefakt_Senden_Sub.svg";
import artefaktObjSVG from "../svg/Artefakt_Allgemein.svg";
import catchEvent from "../svg/IoT_Artefakt_Intermediate_Catch_Event.svg";
import throwEvent from "../svg/IoT_Artefakt_Intermediate_Throw_Event.svg";
import {getFillColor} from "bpmn-js/lib/draw/BpmnRenderUtil";


import {
  append as svgAppend,
  clear as svgClear,
  classes as svgClass,
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

const HIGH_PRIORITY = 9000,
      TASK_BORDER_RADIUS = 2;


export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY);

    this.eventBus = eventBus;
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

      let imageHref, color;
      switch (iotType) {
        case 'start':
          imageHref = startSVG;
          break;
        case 'actor':
          imageHref = actorSVG;
          break;
        case 'actor-sub':
          imageHref = actorSubSVG;
          break;
        case 'obj':
          imageHref = artefaktObjSVG;
          break;
        case 'sensor-sub':
          imageHref = sensorSubSVG;
          break;
        case 'throw':
          imageHref = throwEvent;
          break;
        case 'catch':
          imageHref = catchEvent;
          break;
        case 'sensor':
        default:
          color = getFillColor(element);
          imageHref = sensorSVG;
      }

      const img = drawImg(element.width, element.height, imageHref, color);
      svgClear(parentNode);
      svgAppend(parentNode, img);
      return img;
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

function drawImg(width, height, image, color) {
  const img = svgCreate(image);
  svgAttr(img, {
    width: width,
    height: height,
    strokeWidth: 2,
  });
  switch (color) {
    case 'rgb(245,61,51)':
    svgClass(img).add('svgColorRed');
    break;
    case 'rgba(66, 180, 21, 0.7)':
    svgClass(img).add('svgColorGreen');
    break;
    default:
  }

  return img;
}
