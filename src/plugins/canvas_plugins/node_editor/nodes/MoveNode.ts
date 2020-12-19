import { MeshObj } from "../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, NodeParamField, PortDirection, PortDataFlow } from "../../../../core/models/objs/node_obj/NodeParam";
import { NodeView } from "../../../../core/models/views/NodeView";
import { PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { MeshView } from "../../scene_editor/views/MeshView";
import { AbstractNodeFactory } from "./AbstractNode";
import { MeshController } from "./MeshNode";

export const MoveNodeType = 'move-node-obj';

export class MoveNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = MoveNodeType;
    displayName = 'Move';
    category = 'Default';

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamController(new MeshController(this.registry, nodeView.getObj()), new MeshMoveController(this.registry, nodeView.getObj()), new MeshSpeedController(this.registry, nodeView.getObj()));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, new MoveNodeParams(), {displayName: this.displayName});
        
        obj.executor = new MoveNodeExecutor(this.registry, obj);
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class MoveNodeParams extends NodeParams {
    readonly mesh: NodeParam<MeshObj> = {
        name: 'mesh',
        field: NodeParamField.List,
        val: undefined,
    }
    
    readonly move: NodeParam = {
        name: 'move',
        field: NodeParamField.List,
        val: 'forward',
    }
    
    readonly speed: NodeParam = {
        name: 'speed',
        field: NodeParamField.NumberField,
        val: 0.5,
    }
    
    readonly animation: NodeParam = {
        name: 'animation',
        port: {
            direction: PortDirection.Output,
            dataFlow: PortDataFlow.Push
        }
    }
    
    readonly input: NodeParam = {
        name: 'input',
        port: {
            direction: PortDirection.Input,
            dataFlow: PortDataFlow.Push
        }
    }
}


export class MoveNodeExecutor extends AbstractNodeExecutor<MoveNodeParams> {
    private registry: Registry;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(nodeObj);
        this.registry = registry;
    }

    execute() {
        const meshObj = this.nodeObj.param.mesh.val;
        const speed = this.nodeObj.param.speed.val; 

        if (this.nodeObj.param.move.val === 'forward') {
            meshObj.move(new Point_3(0, 0, speed));
        } else if (this.nodeObj.param.move.val === 'backward') {
            meshObj.move(new Point_3(0, 0, -speed));
        }
    }

    executeStop() {}
}

export class MeshMoveController extends PropController<string> {
    private nodeObj: NodeObj<MoveNodeParams>;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    acceptedProps() { return ['move']; }

    values() {
        return ['forward', 'backward'];
    }

    defaultVal() {
        return this.nodeObj.param.move.val;
    }

    change(val, context) {
        context.updateTempVal(val);
        this.nodeObj.param.move.val = val;
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class MeshSpeedController extends PropController<string> {
    private nodeObj: NodeObj<MoveNodeParams>;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    acceptedProps() { return ['speed']; }

    defaultVal() {
        return this.nodeObj.param.speed.val;
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }

    blur(context: PropContext) {
        this.nodeObj.setParam = context.clearTempVal();
        context.registry.services.render.reRenderAll();
    }
}