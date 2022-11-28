import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';
import inherits from 'inherits';


export default function ResizeTask(eventBus, taskResizingEnabled) {
    RuleProvider.call(this, eventBus);
    this.taskResizingEnabled=taskResizingEnabled || false;
}

inherits(ResizeTask, RuleProvider);

ResizeTask.$inject = [ 'eventBus', 'config.taskResizingEnabled' ];

ResizeTask.prototype.init = function() {
    let me = this;

    me.addRule('shape.resize', 1500, function(data) {
        if (me.taskResizingEnabled && data.shape.businessObject &&
            (data.shape.businessObject.$instanceOf('bpmn:Task') ||
                data.shape.businessObject.$instanceOf('bpmn:CallActivity') ||
                data.shape.businessObject.$instanceOf('bpmn:SubProcess') ||
                data.shape.businessObject.$instanceOf('bpmn:DataObjectReference'))
        ) {
            if (data.newBounds) {
                if(data.shape.businessObject.gateway === "condition"){
                    data.newBounds.width=Math.max(50,data.newBounds.width);
                    data.newBounds.height=Math.max(21,data.newBounds.height);
                    return true;
                }
                if(data.shape.businessObject.$instanceOf('bpmn:DataObjectReference')){
                    data.newBounds.width=Math.max(36,data.newBounds.width);
                    data.newBounds.height=Math.max(50,data.newBounds.height);
                    return true;
                }
                if(data.shape.businessObject.gateway === "and" || data.shape.businessObject.gateway === "or"){
                    data.newBounds.width=Math.max(50,data.newBounds.width);
                    data.newBounds.height=Math.max(20,data.newBounds.height);
                    return true;
                }
                data.newBounds.width=Math.max(100,data.newBounds.width);
                data.newBounds.height=Math.max(42,data.newBounds.height);
            }
            return true;
        }
    });
};
