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

    if ((is(element, 'bpmn:DataObjectReference') || is(element, 'bpmn:StartEvent') || is(element, 'bpmn:IntermediateCatchEvent') || is(element, 'bpmn:IntermediateThrowEvent')) && !isNil(iotType)) {
        group.entries.push(entryFactory.textField(translate, {
            id : 'value',
            description : 'Set value of Data Object',
            label : 'Value',
            modelProperty : 'value'
        }));

        // Hinzufügen einer checkBox
        /* group.entries.push(entryFactory.checkbox(translate, {
            id : 'value1',
            label : 'Value 2',
            modelProperty : 'value 2'
        })); */

        //Hinzufügen DropDown:
        /*
         group.entries.push(entryFactory.selectBox(translate, {
            id : 'value2',
            label : 'Value2',
            selectOptions: [ { name: 'Cool', value: 'ssss' }, { name: 'Nice', value: 'IchSteheImXML' }, { name: 'Scheiß', value: 'nö' }],
            modelProperty : 'value2',
            emptyParameter: false,
            hidden: () => {
                return false;
            },
            disabled: () => {
                return false;
            },
            defaultParameter: [ { name: 'Nice', value: 'ssss' }]
        }));
         */


        //Hinzufügen Tabelle:
        /*
        group.entries.push(entryFactory.table(translate, {
            id: 'TabellenID',
            description: 'test',
            modelProperties: ['decision', 'decision2'],
            labels: ['Decision', 'Decision2'],
            getElements: () => [
                {
                    decision: 'Dec 1',
                    decision2: 'Dec 1',
                },
                {
                    decision: 'Dec 2',
                    decision2: 'Dec 2',
                }
            ],
            updateElement: function(element, value, node, idx) {
                var parent = getParent(element, node, bo),
                    property = getPropertyValues(parent)[idx];

                forEach(modelProperties, function(prop) {
                    value[prop] = value[prop] || undefined;
                });

                return cmdHelper.updateBusinessObject(element, property, value);
            },
            removeElement: function(element, node, idx) {
                var commands = [],
                    parent = getParent(element, node, bo),
                    properties = getPropertiesElement(parent),
                    propertyValues = getPropertyValues(parent),
                    currentProperty = propertyValues[idx];

                commands.push(cmdHelper.removeElementsFromList(element, properties, 'values', null, [ currentProperty ]));

                if (propertyValues.length === 1) {

                    // remove camunda:properties if the last existing property has been removed
                    if (!isExtensionElements(parent)) {
                        commands.push(cmdHelper.updateBusinessObject(element, parent, { properties: undefined }));
                    } else {
                        forEach(parent.values, function(value) {
                            if (is(value, 'camunda:Properties')) {
                                commands.push(extensionElementsHelper.removeEntry(bo, element, value));
                            }
                        });
                    }
                }

                return commands;
            },

            addElement: function(element, node) {
                var commands = [],
                    parent = getParent(element, node, bo);

                if (!parent && typeof createParent === 'function') {
                    var result = createParent(element, bo);
                    parent = result.parent;
                    commands.push(result.cmd);
                }

                var properties = getPropertiesElement(parent);
                if (!properties) {
                    properties = elementHelper.createElement('camunda:Properties', {}, parent, bpmnFactory);

                    if (!isExtensionElements(parent)) {
                        commands.push(cmdHelper.updateBusinessObject(element, parent, { 'properties': properties }));
                    } else {
                        commands.push(cmdHelper.addAndRemoveElementsFromList(
                            element,
                            parent,
                            'values',
                            'extensionElements',
                            [ properties ],
                            []
                        ));
                    }
                }

                var propertyProps = {};
                forEach(modelProperties, function(prop) {
                    propertyProps[prop] = undefined;
                });

                // create id if necessary
                if (modelProperties.indexOf('id') >= 0) {
                    propertyProps.id = generatePropertyId();
                }

                var property = elementHelper.createElement('camunda:Property', propertyProps, properties, bpmnFactory);
                commands.push(cmdHelper.addElementsTolist(element, properties, 'values', [ property ]));

                return commands;
            },

            //addElement: () => { return true; },

            editable: () => { return true;},
            setControlValue: () => { },
            show: true
            // Wenn mehrere Spalten hinzugefügt werden sollen dann einfach Array erweitern:
            //modelProperties: ['decision', 'result'],
            //labels: ['Decision', 'Result'],
        }));
        */
    }
}

function getIotType(element) {
    const businessObject = getBusinessObject(element);

    const type = businessObject.get('iot:type');

    return type ? type : null;
}
