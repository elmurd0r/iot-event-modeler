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
      'create.iot-sensor': {
        group: 'iot',
        title: translate('Create IoT Sensor Artifact'),
        className: 'iot-sensor iot-palette-element',
        iot: 'sensor',
        action: {
          dragstart: createIotObj("sensor"),
          click: createIotObj("sensor")
        }
      },
        'create.iot-decision-group': {
          group: 'iot',
          className: 'iot-decision-container iot-palette-element',
          title: translate('Create IoT Decision Container'),
          iot: 'decision-group',
          action: {
            dragstart: createDecision("decision-group"),
            click: createDecision("decision-group"),
          }
      },
      'create.iotr-or-gateway': {
        group: 'iotr',
        iot: 'or',
        className: 'iotr-gateway iot-palette-element',
        title: translate('Create Or Conjunction'),
        action: {
          dragstart: createRuleGateway("or"),
          click: createRuleGateway("or")
        }
      },
      'create.iotr-and-gateway': {
        group: 'iotr',
        iot: 'and',
        className: 'iotr-gateway iot-palette-element',
        title: translate('Create And Conjunction'),
        action: {
          dragstart: createRuleGateway("and"),
          click: createRuleGateway("and")
        }
      },
      'create.iotr-result-gateway': {
        group: 'iotr',
        iot: 'result',
        className: 'iotr-gateway iot-palette-element',
        title: translate('Create Output-Entry'),
        action: {
          dragstart: createRuleGateway("result"),
          click: createRuleGateway("result")
        }
      },
        'create.iotr-condition-gateway': {
      group: 'iotr',
          iot: 'condition',
          className: 'iotr-gateway iot-palette-element',
          title: translate('Create Condition'),
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
        title: translate('Create IoT conditional intermediate event'),
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
