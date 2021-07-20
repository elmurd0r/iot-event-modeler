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

    return {
      'create.iot-sensor': {
        group: 'iot',
        title: translate('Create IoT Sensor'),
        className: 'iot sensor',
        action: {
          dragstart: createIotObj("sensor"),
          click: createIotObj("sensor")
        }
      },
      'create.iot-actor': {
        group: 'iot',
        className: 'iot actor',
        title: translate('Create IoT Actor'),
        action: {
          dragstart: createIotObj("actor"),
          click: createIotObj("actor")
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
