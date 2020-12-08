import { NodeObj, NodeParam, NodeParamFieldType, NodeParams, NodeParamType } from "../../../../core/models/objs/NodeObj";
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
        nodeView.addParamController(new MeshController(nodeView), new MeshMoveController(nodeView.getObj()), new MeshSpeedController(nodeView.getObj()));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        
        obj.executor = new MoveNodeExecutor(this.registry, obj);
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;
        obj.param = new MoveNodeParams();

        return obj;
    }
}

export class MoveNodeParams implements NodeParams {
    mesh = {
        name: 'mesh',
        type: NodeParamType.InputField,
        fieldType: NodeParamFieldType.List,
        val: '',
    }
    
    move = {
        name: 'move',
        type: NodeParamType.InputField,
        fieldType: NodeParamFieldType.List,
        val: 'forward',
    }
    
    speed = {
        name: 'speed',
        type: NodeParamType.InputField,
        fieldType: NodeParamFieldType.NumberField,
        val: 0.5,
    }
    
    animation = {
        name: 'animation',
        type: NodeParamType.Port,
        port: 'output'
    }
    
    input = {
        name: 'input',
        type: NodeParamType.Port,
        port: 'input'
    }
}


export class MoveNodeExecutor extends AbstractNodeExecutor<MoveNodeParams> {
    private registry: Registry;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(nodeObj);
        this.registry = registry;
    }

    execute() {
        const meshId = this.nodeObj.param.mesh.val;

        const meshView = this.registry.data.view.scene.getById(meshId) as MeshView;

        const speed = this.nodeObj.param.speed.val; 

        if (this.nodeObj.param.move.val === 'forward') {
            meshView.getObj().move(new Point_3(0, 0, speed));
        } else if (this.nodeObj.param.move.val === 'backward') {
            meshView.getObj().move(new Point_3(0, 0, -speed));
        }
    }

    executeStop() {}
}

export class MeshMoveController extends PropController<string> {
    private nodeObj: NodeObj;

    constructor(nodeObj: NodeObj) {
        super();
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
        this.nodeObj.param.move = val;
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class MeshSpeedController extends PropController<string> {
    private nodeObj: NodeObj<MoveNodeParams>;

    constructor(nodeObj: NodeObj) {
        super();
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