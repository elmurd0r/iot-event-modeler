import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  append as svgAppend,
  prepend as svgPrepend,
  remove as svgRemove,
  attr as svgAttr,
  classes as svgClasses,
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
      TASK_BORDER_RADIUS = 2,
      COLOR_GREEN = '#52B415',
      COLOR_YELLOW = '#ffc800',
      COLOR_RED = '#cc0000';


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
        case 'actor':
          imageHref = "./artifact.svg";
          break
        case 'sensor':
        default:
          imageHref = "./sensor.png";
      }

      const img = drawIot(parentNode, 36, 52, imageHref);
      //const img = drawIot(parentNode, element.width, element.height);


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

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect(parentNode, width, height, borderRadius, color) {
  const rect = svgCreate('rect');

  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: color,
    strokeWidth: 2,
    fill: color
  });

  svgAppend(parentNode, rect);

  return rect;
}

function drawIot(parentNode, width, height, image) {
    const img = svgCreate('image');

    svgAttr(img, {
      width: width,
      height: height,
      strokeWidth: 2,
      href: image
    });

    return img;
}
function prependTo(newNode, parentNode, siblingNode) {
  parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild);
}
