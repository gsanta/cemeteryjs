import { RayCasterConfig } from "../../../../core/engine/IRayCasterAdapter";
import { NodePort, NodeObj, NodeParam } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { PropContext, PropController } from "../../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { INodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { AbstractNodeFactory } from "./AbstractNode";

export const RayHelperNodeType = 'ray-helper-node-obj';

export class RayHelperNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = RayHelperNodeType;
    displayName = 'RayHelper';
    category = 'Default';

    createView(): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.addParamController(new RemoveTimerController(nodeView));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        
        obj.addAllParams(this.getParams());
        obj.inputs = this.getInputPorts();
        obj.outputs = this.getOutputLinks();
        obj.executor = new RayHelperNodeExecutor(this.registry, obj);
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }

    private getParams(): NodeParam[] {
        return [
            {
                name: 'remove',
                val: '',
                uiOptions: {
                    inputType: 'textField',
                    valueType: 'number'
                }
            }
        ];
    }

    private getOutputLinks(): NodePort[] {
        return [
            {
                name: 'rayCaster'
            }
        ];
    }

    private getInputPorts(): NodePort[] {
        return [

        ];
    }
}

export class RayHelperNodeExecutor implements INodeExecutor {
    private registry: Registry;
    private nodeObj: NodeObj;

    constructor(registry: Registry, nodeObj: NodeObj) {
        this.registry = registry;
        this.nodeObj = nodeObj;
    }

    execute() {
        const connection = this.nodeObj.getConnection('rayCaster');
        if (connection) {
            const rayCasterNode = connection[0];
            (rayCasterNode.getParam('rayCasterConfig').val as RayCasterConfig).helper = true;
        }
    }

    executeStop() {}
}

class RemoveTimerController extends PropController<string> {
    private nodeView: NodeView;

    constructor(nodeView: NodeView) {
        super();
        this.nodeView = nodeView;
    }

    acceptedProps() { return ['remove']; }

    defaultVal() {
        return this.nodeView.getObj().getParam('remove').val;
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }

    blur(context: PropContext) {
        const nodeObj = this.nodeView.getObj();
        nodeObj.setParam('remove', context.clearTempVal());
        context.registry.services.render.reRenderAll();
    }
}