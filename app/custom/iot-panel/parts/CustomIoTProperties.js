'use strict';

var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    is = require('bpmn-js/lib/util/ModelUtil').is;

var factory = require('./CustomIotEntryFactory');

var elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
    extensionElementsHelper = require('bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper'),
    cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
    utils = require('bpmn-js-properties-panel/lib/Utils');

var assign = require('lodash/assign'),
    forEach = require('lodash/forEach'),
    find = require('lodash/find');

function generatePropertyId() {
    return utils.nextId('Property_');
}

/**
 * Get all camunda:property objects for a specific business object
 *
 * @param  {ModdleElement} parent
 *
 * @return {Array<ModdleElement>} a list of camunda:property objects
 */
function getPropertyValues(parent) {
    var properties = parent && getPropertiesElement(parent);
    if (properties && properties.values) {
        return properties.values;
    }
    return [];
}

/**
 * Get all camunda:Properties object for a specific business object
 *
 * @param  {ModdleElement} parent
 *
 * @return {ModdleElement} a camunda:Properties object
 */
function getPropertiesElement(element) {
    if (!isExtensionElements(element)) {
        return element.properties;
    } else {
        return getPropertiesElementInsideExtensionElements(element);
    }
}

/**
 * Get first camunda:Properties object for a specific bpmn:ExtensionElements
 * business object.
 *
 * @param {ModdleElement} extensionElements
 *
 * @return {ModdleElement} a camunda:Properties object
 */
function getPropertiesElementInsideExtensionElements(extensionElements) {
    return find(extensionElements.values, function(elem) {
        return is(elem, 'iot:Properties');
    });
}

/**
 * Returns true, if the given business object is a bpmn:ExtensionElements.
 *
 * @param {ModdleElement} element
 *
 * @return {boolean} a boolean value
 */
function isExtensionElements(element) {
    return is(element, 'bpmn:ExtensionElements');
}

/**
 * Create a camunda:property entry using tableEntryFactory
 *
 * @param  {djs.model.Base} element
 * @param  {BpmnFactory} bpmnFactory
 * @param  {Object} options
 * @param  {string} options.id
 * @param  {Array<string>} options.modelProperties
 * @param  {Array<string>} options.labels
 * @param  {function} options.getParent Gets the parent business object
 * @param  {function} options.show Indicate when the entry will be shown, should return boolean
 */
module.exports = function(iotType, element, bpmnFactory, options, translate) {
    var getParent = options.getParent;

    var modelProperties = options.modelProperties,
        createParent = options.createParent;

    var bo = getBusinessObject(element);
    if (is(element, 'bpmn:Participant')) {
        bo = bo.get('processRef');
    }

    // build properties group only when the participant have a processRef
    if (!bo) {
        return;
    }
    if(iotType === 'sensor' || iotType === 'actor' || iotType === 'start' || iotType === 'catch' || iotType === 'throw' || iotType === 'artefact-catch' || iotType === 'end') {
        if(bo.extensionElements?.values.some((e)=>e['$type'] === 'iot:Properties')) {
            options.disableAddRow = true;
        }
    }
    assign(options, {
        addLabel: translate('Add Property'),
        getElements: function(element, node) {
            var parent = getParent(element, node, bo);
            return getPropertyValues(parent);
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
                    properties = elementHelper.createElement('iot:Properties', {}, parent, bpmnFactory);

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

                var property = elementHelper.createElement('iot:Property', propertyProps, properties, bpmnFactory);
                commands.push(cmdHelper.addElementsTolist(element, properties, 'values', [ property ]));

                if(iotType === 'sensor' || iotType === 'actor' || iotType === 'start' || iotType === 'catch' || iotType === 'throw' || iotType === 'artefact-catch' || iotType === 'end') {
                    document.querySelector("div [data-entry='IoTproperties'] .add").disabled = true;
                }
            return commands;
        },
        updateElement: function(element, value, node, idx) {
            var parent = getParent(element, node, bo),
                property = getPropertyValues(parent)[idx];

            forEach(modelProperties, function(prop) {
                value[prop] = value[prop] || undefined;
            });

            return cmdHelper.updateBusinessObject(element, property, value);
        },
        validate: function(element, value, node, idx) {

            // validate id if necessary
            if (modelProperties.indexOf('id') >= 0) {

                var parent = getParent(element, node, bo),
                    properties = getPropertyValues(parent),
                    property = properties[idx];

                if (property) {

                    // check if id is valid
                    var validationError = utils.isIdValid(property, value.id, translate);

                    if (validationError) {
                        return { id: validationError };
                    }
                }
            }
        },
        removeElement: function(element, node, idx) {
            if(iotType === 'sensor' || iotType === 'actor' || iotType === 'start' || iotType === 'catch' || iotType === 'throw' || iotType === 'artefact-catch' || iotType === 'end') {
                document.querySelector("div [data-entry='IoTproperties'] .add").disabled = false;
            }
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
                        if (is(value, 'iot:Properties')) {
                            commands.push(extensionElementsHelper.removeEntry(bo, element, value));
                        }
                    });
                }
            }

            return commands;
        }
    });

    return factory.table(translate, options);
};
