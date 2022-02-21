import inherits from 'inherits';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';


/**
 * A custom rule provider that decides which association
 * an iot artefact has, based on iot type.
 *
 * See {@link BpmnRules} for the default implementation
 * of BPMN 2.0 modeling rules provided by bpmn-js.
 *
 * @param {EventBus} eventBus
 */
export default function CustomIotArtefactRules(eventBus) {
    RuleProvider.call(this, eventBus);
}

inherits(CustomIotArtefactRules, RuleProvider);

CustomIotArtefactRules.$inject = [ 'eventBus' ];


CustomIotArtefactRules.prototype.init = function() {

    // if nothing is returned default rules will be applied
    const handleAssociation = (context) => {
        let source = context.source;
        let iotTypeSource = source.businessObject.type;
        if (iotTypeSource === "actor" || iotTypeSource === "actor-sub") {
            return false;
        }
        let target = context.target;
        let iotTypeTarget = target.businessObject.type;
        if (iotTypeTarget === "sensor" || iotTypeTarget === "sensor-sub" || iotTypeTarget === "artefact-catch" || iotTypeTarget === "artefact-catch-sub") {
            return false;
        }
    }
    // priority is important
    this.addRule('connection.create', 1500, (context) => {
        if(context.source.businessObject.type === 'decision-group' || context.target.businessObject.type === 'decision-group') {
            if(context.target.type === 'bpmn:Task' && context.source.parent.businessObject.type !== 'decision-group') {
                return {
                    type: 'bpmn:DataInputAssociation'
                };
            }
            return false;
        }

        return handleAssociation(context);
    });

    this.addRule('shape.create', 1500, (context) => {
        if(context.target.businessObject.type === 'decision-group') {
            if(context.shape.businessObject.type === 'sensor' || context.shape.businessObject.type === 'decision-group') {
                return true;
            }
            return false;
        }
    });

    this.addRule('elements.move', 1500, (context) => {
        if ( context.target?.businessObject.type === 'decision-group') {
            let shapes = context.shapes;
            let impossibleToAdd =  shapes.some(shape => shape.businessObject.type !== 'sensor' && shape.businessObject.type !== 'decision-group');
            if(!impossibleToAdd) {
                return true;
            }
            return false;
        }
    });

    this.addRule('connection.reconnect', 1500, (context) => {
        return handleAssociation(context);
    });
};

