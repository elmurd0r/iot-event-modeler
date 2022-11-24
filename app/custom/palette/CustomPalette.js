export default class CustomPalette {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const {
      bpmnFactory,
      create,
      elementFactory,
      translate
    } = this;

    function createDecision(decisionType) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:SubProcess');
        businessObject.set('type', decisionType);

        const shape = elementFactory.createShape({
          type: 'bpmn:SubProcess',
          businessObject: businessObject,
          isExpanded: true
        });
        create.start(event, shape);
      };
    }


    function createIotObj(iotType) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:DataObjectReference');
        businessObject.set('iot:type', iotType);

        const shape = elementFactory.createShape({
          type: 'bpmn:DataObjectReference',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }

    function createIotStart(iotType) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:StartEvent');
        businessObject.set('iot:type', iotType);

        const shape = elementFactory.createShape({
          type: 'bpmn:StartEvent',
          businessObject: businessObject,
          eventDefinitionType: 'bpmn:MessageEventDefinition'
        });

        create.start(event, shape);
      };
    }

    function createIotEnd(iotType) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:EndEvent');
        businessObject.set('iot:type', iotType);

        const shape = elementFactory.createShape({
          type: 'bpmn:EndEvent',
          businessObject: businessObject,
          eventDefinitionType: 'bpmn:MessageEventDefinition'
        });

        create.start(event, shape);
      };
    }

    function createIoTCatchEvent(iotType) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:IntermediateCatchEvent');
        businessObject.set('iot:type', iotType);

        const shape = elementFactory.createShape({
          type: 'bpmn:IntermediateCatchEvent',
          businessObject: businessObject,
          eventDefinitionType: 'bpmn:MessageEventDefinition'
        });

        create.start(event, shape);
      }
    }

    function createIoTThrowEvent(iotType) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:IntermediateCatchEvent');
        businessObject.set('iot:type', iotType);

        const shape = elementFactory.createShape({
          type: 'bpmn:IntermediateCatchEvent',
          businessObject: businessObject,
          eventDefinitionType: 'bpmn:MessageEventDefinition'
        });

        create.start(event, shape);
      }
    }

    function createRuleOperator(param) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:TextAnnotation');
        businessObject.set('iotr:operator', '&&');

        const shape = elementFactory.createShape({
          type: 'bpmn:TextAnnotation',
          businessObject: businessObject
        });
        create.start(event, shape);
      };
    }

    function createRuleGateway(param) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:Task');
        businessObject.set('iotr:gateway', param);

        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          businessObject: businessObject
        });
        shape.height = 42;
        if (param === 'condition') {
          shape.height = 21;
        }
        create.start(event, shape);
      };
    }

    function createIotConditionalStart() {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:StartEvent');
        businessObject.set('iotr:eventType', 'cond-start');

        const shape = elementFactory.createShape({
          type: 'bpmn:StartEvent',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }

    function createIotConditionalInterm() {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:IntermediateCatchEvent');
        businessObject.set('iotr:eventType', 'cond-interm');

        const shape = elementFactory.createShape({
          type: 'bpmn:IntermediateCatchEvent',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }

    return {
      'create.iot-start': {
        group: 'iot',
        className: 'iot-start iot-palette-element',
        title: translate('Create IoT Start'),
        iot: 'start',
        action: {
          dragstart: createIotStart("start"),
          click: createIotStart("start")
        }
      },
      'create.iot-catch': {
        group: 'iot',
        className: 'iot-catch iot-palette-element',
        title: translate('Create IoT Catch Event'),
        iot: 'catch',
        action: {
          dragstart: createIoTCatchEvent("catch"),
          click: createIoTCatchEvent("catch")
        }
      },
      'create.iot-throw': {
        group: 'iot',
        className: 'iot-throw iot-palette-element',
        title: translate('Create IoT Throw Event'),
        iot: 'throw',
        action: {
          dragstart: createIoTThrowEvent("throw"),
          click: createIoTThrowEvent("throw")
        }
      },
      'create.iot-end': {
        group: 'iot',
        className: 'iot-end iot-palette-element',
        title: translate('Create IoT End'),
        iot: 'end',
        action: {
          dragstart: createIotEnd("end"),
          click: createIotEnd("end")
        }
      },
      'create.iot-sensor': {
        group: 'iot',
        title: translate('Create IoT Sensor'),
        className: 'iot-sensor iot-palette-element',
        iot: 'sensor',
        action: {
          dragstart: createIotObj("sensor"),
          click: createIotObj("sensor")
        }
      },
      'create.iot-sensor-sub': {
        group: 'iot',
        className: 'iot-sensor-sub iot-palette-element',
        title: translate('Create IoT Sensor Sub'),
        iot: 'sensor-sub',
        action: {
          dragstart: createIotObj("sensor-sub"),
          click: createIotObj("sensor-sub")
        }
      },
      'create.iot-actor': {
        group: 'iot',
        className: 'iot-actor iot-palette-element',
        title: translate('Create IoT Actor'),
        iot: 'actor',
        action: {
          dragstart: createIotObj("actor"),
          click: createIotObj("actor")
        }
      },
      'create.iot-actor-sub': {
        group: 'iot',
        className: 'iot-actor-sub iot-palette-element',
        title: translate('Create IoT Actor Sub'),
        iot: 'actor-sub',
        action: {
          dragstart: createIotObj("actor-sub"),
          click: createIotObj("actor-sub")
        }
      },
      'create.iot-artefact-catch': {
        group: 'iot',
        className: 'iot-artefact-catch iot-palette-element',
        title: translate('Create IoT Artefact Catch'),
        iot: 'artefact-catch',
        action: {
          dragstart: createIotObj("artefact-catch"),
          click: createIotObj("artefact-catch")
        }
      },
      'create.iot-artefact-catch-sub': {
        group: 'iot',
        className: 'iot-artefact-catch-sub iot-palette-element',
        title: translate('Create IoT Artefact Catch Sub'),
        iot: 'artefact-catch-sub',
        action: {
          dragstart: createIotObj("artefact-catch-sub"),
          click: createIotObj("artefact-catch-sub")
        }
      },
        'create.iot-decision-group': {
          group: 'iot',
          className: 'iot-decision-container iot-palette-element',
          title: translate('Create IoT Decision Group'),
          iot: 'decision-group',
          action: {
            dragstart: createDecision("decision-group"),
            click: createDecision("decision-group"),
          }
      },
      'create.iot-obj': {
        group: 'iot',
        className: 'iot-artefact-obj iot-palette-element',
        title: translate('Create IoT Artifact Object'),
        iot: 'obj',
        action: {
          dragstart: createIotObj("obj"),
          click: createIotObj("obj")
        }
      },
      'create.iotr-or-gateway': {
        group: 'iotr',
        iot: 'or',
        className: 'iotr-gateway iot-palette-element',
        title: translate('Create IoT OR Gateway'),
        action: {
          dragstart: createRuleGateway("or"),
          click: createRuleGateway("or")
        }
      },
      'create.iotr-and-gateway': {
        group: 'iotr',
        iot: 'and',
        className: 'iotr-gateway iot-palette-element',
        title: translate('Create IoT AND Gateway'),
        action: {
          dragstart: createRuleGateway("and"),
          click: createRuleGateway("and")
        }
      },
      'create.iotr-result-gateway': {
        group: 'iotr',
        iot: 'result',
        className: 'iotr-gateway iot-palette-element',
        title: translate('Create IoT Result Gateway'),
        action: {
          dragstart: createRuleGateway("result"),
          click: createRuleGateway("result")
        }
      },
        'create.iotr-condition-gateway': {
      group: 'iotr',
          iot: 'condition',
          className: 'iotr-gateway iot-palette-element',
          title: translate('Create IoT condition Gateway'),
          action: {
        dragstart: createRuleGateway("condition"),
            click: createRuleGateway("condition")
      }
    },
      'create.iotr-conditionalStart': {
        group: 'iotr',
        iot: 'cond-start',
        className: 'iotr-event iot-palette-element',
        title: translate('Create IoT conditional start event'),
        action: {
          dragstart: createIotConditionalStart(),
          click: createIotConditionalStart()
        }
      },
      'create.iotr-conditionalInterm': {
        group: 'iotr',
        iot: 'cond-interm',
        className: 'iotr-event iot-palette-element',
        title: translate('Create IoT conditional Intermediate event'),
        action: {
          dragstart: createIotConditionalInterm(),
          click: createIotConditionalInterm()
        }
      }
    };
  }
}

CustomPalette.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];
