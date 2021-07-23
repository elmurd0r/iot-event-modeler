import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import {
    getBusinessObject,
    is
} from 'bpmn-js/lib/util/ModelUtil';
import {isNil} from "min-dash";



export default function(group, element, translate) {

    // Only return an entry, if the currently selected
    // element is a start event.
    const iotType = getIotType(element);

    if (is(element, 'bpmn:DataObjectReference') && !isNil(iotType)) {
        group.entries.push(entryFactory.textField(translate, {
            id : 'value',
            description : 'Set value of Data Object',
            label : 'Value',
            modelProperty : 'value'
        }));
    }
}

function getIotType(element) {
    const businessObject = getBusinessObject(element);

    const type = businessObject.get('iot:type');

    return type ? type : null;
}
