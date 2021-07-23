// Require your custom property entries.
import spellProps from './parts/ValueProps';

let LOW_PRIORITY = 500;


// Create the custom magic tab.
// The properties are organized in groups.
function createIotTabGroups(element, translate) {

    // Create a group called "Black Magic".
    let iotGroup = {
        id: 'iot-group',
        label: 'IoT Group',
        entries: []
    };

    // Add the spell props to the black magic group.
    spellProps(iotGroup, element, translate);

    return [
        iotGroup
    ];
}

export default function IotPropertiesProvider(propertiesPanel, translate) {

    // Register our custom magic properties provider.
    // Use a lower priority to ensure it is loaded after the basic BPMN properties.
    propertiesPanel.registerProvider(LOW_PRIORITY, this);

    this.getTabs = function(element) {

        return function(entries) {

            // Add the "magic" tab
            let iotTab = {
                id: 'iot',
                label: 'IoT',
                groups: createIotTabGroups(element, translate)
            };

            entries.push(iotTab);

            // Show general + "iot" tab
            return entries;
        }
    };
}


IotPropertiesProvider.$inject = [ 'propertiesPanel', 'translate' ]
