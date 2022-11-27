var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');
const {getBusinessObject} = require("bpmn-js/lib/util/ModelUtil");

var is = require('bpmn-js/lib/util/ModelUtil').is;

module.exports = function(group, element, translate) {
    let gatewayType = getGateawyType(element)
    if (gatewayType === 'result') {
        group.entries.push(entryFactory.textField(translate, {
            id : 'prio',
            description : 'Add Rule Priority',
            label : 'Priority',
            modelProperty : 'prio'
        }));
    }
};


function getGateawyType(element) {
    const businessObject = getBusinessObject(element);

    const type = businessObject.get('iotr:gateway');

    return type ? type : null;
}
