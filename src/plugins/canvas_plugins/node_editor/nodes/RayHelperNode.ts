import { NodeObj, NodeParamField, NodeParams, NodeParamRole, NodeParam, PortDirection, PortDataFlow } from "../../../../core/models/objs/NodeObj";
import { RayObj } from "../../../../core/models/objs/RayObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { PropContext, PropController } from "../../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../core/services/node/INodeExecutor";
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

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamController(new RemoveTimerController(nodeView.getObj()));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        
        obj.executor = new RayHelperNodeExecutor(this.registry, obj);
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;
        obj.param = new RayHelperNodeParams();

        return obj;
    }
}

export class RayHelperNodeParams extends NodeParams {
    remove: NodeParam = {
        name: 'remove',
        field: NodeParamField.NumberField,
        val: -1
    }
    
    rayCaster: NodeParam = {
        name: 'rayCaster',
        port: {
            direction: PortDirection.Output,
            dataFlow: PortDataFlow.Push
        }
    }
}

export class RayHelperNodeExecutor extends AbstractNodeExecutor<RayHelperNodeParams> {
    private registry: Registry;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(nodeObj);
        this.registry = registry;
    }

    execute() {
        const connection = this.nodeObj.getConnection('rayCaster');
        if (connection) {
            const rayCasterNode = connection[0];
            const rayObj = rayCasterNode.param.ray.val as RayObj;

            this.registry.engine.rays.createHelper(rayObj);
            
            if (this.nodeObj.param.remove.val && this.nodeObj.param.remove.val !== -1) {
                setTimeout(() => this.registry.engine.rays.removeHelper(rayObj), this.nodeObj.param.remove.val * 1000);
            }
        }

    }

    executeStop() {}
}

class RemoveTimerController extends PropController<string> {
    private nodeObj: NodeObj<RayHelperNodeParams>;

    constructor(nodeObj: NodeObj) {
        super();
        this.nodeObj = nodeObj;
    }

    acceptedProps() { return ['remove']; }

    defaultVal() {
        return this.nodeObj.param.remove.val;
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }

    blur(context: PropContext) {
        this.nodeObj.param.remove = context.clearTempVal();
        context.registry.services.render.reRenderAll();
    }
}