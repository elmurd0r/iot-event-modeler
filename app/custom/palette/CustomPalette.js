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

    function createIotObj(iotType) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:DataObjectReference');

        businessObject.set('iot:type', iotType);

        businessObject.iotType = iotType;

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

        businessObject.iotType = iotType;

        const shape = elementFactory.createShape({
          type: 'bpmn:StartEvent',
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

        businessObject.iotType = iotType;

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
        const businessObject = bpmnFactory.create('bpmn:IntermediateThrowEvent');

        businessObject.set('iot:type', iotType);

        businessObject.iotType = iotType;

        const shape = elementFactory.createShape({
          type: 'bpmn:IntermediateThrowEvent',
          businessObject: businessObject,
          eventDefinitionType: 'bpmn:MessageEventDefinition'
        });

        create.start(event, shape);
      }
    }

    return {
      'create.iot-sensor': {
        group: 'iot',
        title: translate('Create IoT Sensor'),
        className: 'iot-sensor',
        iot: 'sensor',
        action: {
          dragstart: createIotObj("sensor"),
          click: createIotObj("sensor")
        }
      },
      'create.iot-actor': {
        group: 'iot',
        className: 'iot-actor',
        title: translate('Create IoT Actor'),
        iot: 'actor',
        action: {
          dragstart: createIotObj("actor"),
          click: createIotObj("actor")
        }
      },
      'create.iot-sensor-sub': {
        group: 'iot',
        className: 'iot-sensor-sub',
        title: translate('Create IoT Sensor Sub'),
        iot: 'sensor-sub',
        action: {
          dragstart: createIotObj("sensor-sub"),
          click: createIotObj("sensor-sub")
        }
      },
      'create.iot-actor-sub': {
        group: 'iot',
        className: 'iot-actor-sub',
        title: translate('Create IoT Actor Sub'),
        iot: 'actor-sub',
        action: {
          dragstart: createIotObj("actor-sub"),
          click: createIotObj("actor-sub")
        }
      },
      'create.iot-obj': {
        group: 'iot',
        className: 'iot-obj',
        title: translate('Create IoT Object'),
        iot: 'iot-obj',
        action: {
          dragstart: createIotObj("obj"),
          click: createIotObj("obj")
        }
      },
      'create.iot-start': {
        group: 'iot',
        className: 'iot-start',
        title: translate('Create IoT Start'),
        iot: 'start',
        action: {
          dragstart: createIotStart("start"),
          click: createIotStart("start")
        }
      },
      'create.iot-catch': {
        group: 'iot',
        className: 'iot-catch',
        title: translate('Create IoT Catch Event'),
        iot: 'catch',
        action: {
          dragstart: createIoTCatchEvent("catch"),
          click: createIoTCatchEvent("catch")
        }
      },
      'create.iot-throw': {
        group: 'iot',
        className: 'iot-throw',
        title: translate('Create IoT Throw Event'),
        iot: 'throw',
        action: {
          dragstart: createIoTThrowEvent("throw"),
          click: createIoTThrowEvent("throw")
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
