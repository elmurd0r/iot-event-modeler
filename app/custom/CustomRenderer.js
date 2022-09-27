import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import {getFillColor, getStrokeColor} from "bpmn-js/lib/draw/BpmnRenderUtil";


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
import {getSvg} from "./CustomUtil";
import Color from "./helper/Color";

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
    if (!isNil(iotType) && iotType !== 'decision-group') {

      let svg, color;

      switch (getFillColor(element)) {
        case Color.red:
          color = 'RED';
          break;
        case Color.green_low_opacity:
        case Color.green_full_opacity:
          color = 'GREEN';
          break;
        case Color.orange:
          color = 'ORANGE';
          break;
        default:
      }
      svg = getSvg(iotType, color);

      let svgElement = renderSVG(element.width, element.height, svg, color);
      svgClear(parentNode);
      svgAppend(parentNode, svgElement);
      return svgElement;
    }
    if (!isNil(iotType) && iotType === 'decision-group') {
      const DECISION_CONTAINER_PATH = {
        d: 'm 6 6 l 0 4 l 20 0 l 0 -4 z m 0 0 l 0 12 l 20 0 l 0 -12 z m 0 8 l 20 0 m -13 -4 l 0 8 M 30 10 C 34 6 38 6 42 10 M 32 12 V 12 C 34 9 38 9 40 12 M 34 14 C 34 12 38 12 38 14 M 35 16 A 1 1 0 0 0 37 16 A 1 1 0 0 0 35 16'
      }
      const abspos = {
        abspos: {
          x: 8,
          y:8
        }
      }
      let pathData = getScaledPath(DECISION_CONTAINER_PATH, abspos)
      this.bpmnRenderer._drawPath(parentNode, pathData, {
        strokeWidth: 1,
        stroke: getStrokeColor(element, 'black')
      });
    }

    return shape;
  }

  getIotType(element) {
    const businessObject = getBusinessObject(element);
    const type = businessObject.get('iot:type');
    return type || null;
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
  const img = svgCreate('image');
  svgAttr(img, {
    width: width,
    height: height,
    strokeWidth: 2,
    href: image
  });
  switch (color) {
    case Color.red:
    svgClass(img).add('svgColorRed');
    break;
    case Color.green_low_opacity:
    svgClass(img).add('svgColorGreen');
    break;
    default:
  }

  return img;
}

function renderSVG(width, height, svg, color) {
  let svgContainer = svgCreate(svg);
  svgAttr(svgContainer, {
    width: width,
    height: height
  });
  switch (color) {
    case Color.red:
      svgClass(svgContainer).add('svgColorRed');
      break;
    case Color.green_low_opacity:
      svgClass(svgContainer).add('svgColorGreen');
      break;
    default:
  }
  return svgContainer
}

function getScaledPath(rawPath, param) {
  // positioning
  // compute the start point of the path
  var mx, my;

  if (param.abspos) {
    mx = param.abspos.x;
    my = param.abspos.y;
  } else {
    mx = param.containerWidth * param.position.mx;
    my = param.containerHeight * param.position.my;
  }

  var coordinates = {}; // map for the scaled coordinates
  if (param.position) {

    // path
    var heightRatio = (param.containerHeight / rawPath.height) * param.yScaleFactor;
    var widthRatio = (param.containerWidth / rawPath.width) * param.xScaleFactor;


    // Apply height ratio
    for (var heightIndex = 0; heightIndex < rawPath.heightElements.length; heightIndex++) {
      coordinates['y' + heightIndex] = rawPath.heightElements[heightIndex] * heightRatio;
    }

    // Apply width ratio
    for (var widthIndex = 0; widthIndex < rawPath.widthElements.length; widthIndex++) {
      coordinates['x' + widthIndex] = rawPath.widthElements[widthIndex] * widthRatio;
    }
  }

  // Apply value to raw path
  var path = format(
      rawPath.d, {
        mx: mx,
        my: my,
        e: coordinates
      }
  );
  return path;
};


// copied and adjusted from https://github.com/adobe-webplatform/Snap.svg/blob/master/src/svg.js
var tokenRegex = /\{([^{}]+)\}/g,
    objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g; // matches .xxxxx or ["xxxxx"] to run over object properties

function replacer(all, key, obj) {
  var res = obj;
  key.replace(objNotationRegex, function(all, name, quote, quotedName, isFunc) {
    name = name || quotedName;
    if (res) {
      if (name in res) {
        res = res[name];
      }
      typeof res == 'function' && isFunc && (res = res());
    }
  });
  res = (res == null || res == obj ? all : res) + '';

  return res;
}

function format(str, obj) {
  return String(str).replace(tokenRegex, function(all, key) {
    return replacer(all, key, obj);
  });
}
