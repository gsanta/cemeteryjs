import { NodeObj, NodeParam, NodeParamFieldType, NodeParams, NodeParamType } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { MeshView } from "../../scene_editor/views/MeshView";
import { AbstractNodeFactory } from "./AbstractNode";
import { MeshController } from "./MeshNode";

export const RotateNodeType = 'rotate-node-obj';

export class RotateNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = RotateNodeType;
    displayName = 'Rotate';
    category = 'Default';

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamController(new MeshController(nodeView), new MeshRotateController(nodeView.getObj()));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        
        obj.executor = new RotateNodeExecutor(this.registry, obj);
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;
        obj.param = new RotateNodeParams();

        return obj;
    }
}

export class RotateNodeParams implements NodeParams {
    mesh = {
        name: 'mesh',
        type: NodeParamType.InputField,
        fieldType: NodeParamFieldType.List,
        val: ''
    }

    rotate = {
        name: 'rotate',
        type: NodeParamType.InputField,
        fieldType: NodeParamFieldType.List,
        val: 'left'
    }

    input = {
        name: 'input',
        type: NodeParamType.Port,
        port: 'input'
    }
}

export class RotateNodeExecutor extends AbstractNodeExecutor<RotateNodeParams> {
    private registry: Registry;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(nodeObj);
        this.registry = registry;
    }

    execute() {
        const meshId = this.nodeObj.param.mesh.val;

        const meshView = this.registry.data.view.scene.getById(meshId) as MeshView;
        const rotation = meshView.getObj().getRotation();
        if (this.nodeObj.param.rotate.val === 'left') {
            meshView.getObj().setRotation(new Point_3(rotation.x, rotation.y - Math.PI / 30, rotation.z));
        } else if (this.nodeObj.param.rotate.val === 'right') {
            meshView.getObj().setRotation(new Point_3(rotation.x, rotation.y + Math.PI / 30, rotation.z));
        }
    }

    executeStop() {}
}

export class MeshRotateController extends PropController<string> {
    private nodeObj: NodeObj<RotateNodeParams>;

    constructor(nodeObj: NodeObj) {
        super();
        this.nodeObj = nodeObj;
    }

    acceptedProps() { return ['rotate']; }

    values() {
        return ['left', 'right'];
    }

    defaultVal() {
        return this.nodeObj.param.rotate.val;
    }

    change(val, context) {
        context.updateTempVal(val);
        this.nodeObj.param.rotate = val;
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}