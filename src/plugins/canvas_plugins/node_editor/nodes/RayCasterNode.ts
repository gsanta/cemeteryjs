import { NodeObj, NodeParam, NodeParamFieldType, NodeParams, NodeParamType } from "../../../../core/models/objs/NodeObj";
import { RayObj } from "../../../../core/models/objs/RayObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { PropContext, PropController } from "../../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../core/services/node/INodeExecutor";
import { MeshView } from "../../scene_editor/views/MeshView";
import { AbstractNodeFactory } from "./AbstractNode";
import { MeshController } from "./MeshNode";

export const RayCasterNodeType = 'ray-caster-node-obj';

export class RayCasterNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = RayCasterNodeType;
    displayName = 'RayCaster';
    category = 'Default';

    createView(): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.addParamController(new MeshController(nodeView), new RayLengthController(nodeView.getObj()));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj<RayCasterNodeParams> {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.executor = new RayCasterNodeExecutor(this.registry, obj);
        obj.graph = this.registry.data.helper.node.graph;
        obj.param = new RayCasterNodeParams();
        return obj;
    }
}

export class RayCasterNodeParams implements NodeParams {
    mesh = {
        name: 'mesh',
        type: NodeParamType.InputField,
        fieldType: NodeParamFieldType.List,
        val: '',

    }
    
    length = {
        name: 'length',
        type: NodeParamType.InputField,
        fieldType: NodeParamFieldType.NumberField,
        val: 100,
    }
    
    ray = {
        type: NodeParamType.Hidden,
        name: 'ray',
        val: new RayObj
    }
    
    when = {
        type: NodeParamType.Port,
        name: 'when',
        port: 'input'
    }
    
    helper = {
        type: NodeParamType.Port,
        name: 'helper',
        port: 'input'
    }
    
    pickedMesh = {
        type: NodeParamType.Port,
        name: 'pickedMesh',
        port: 'output'
    }
}

export class RayCasterNodeExecutor extends AbstractNodeExecutor<RayCasterNodeParams> {
    private registry: Registry;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(nodeObj);
        this.registry = registry;
    }

    execute() {
        const meshId = this.nodeObj.param.mesh.val;
        const meshView = this.registry.data.view.scene.getById(meshId) as MeshView;

        if (meshView) {
            const rayObj = this.nodeObj.param.ray.val;
            rayObj.meshObj = meshView.getObj();
            rayObj.rayLength = this.nodeObj.param.length.val;
            this.registry.engine.rays.createInstance(rayObj);
            this.registry.services.node.executePort(this.nodeObj, 'helper');

            if (rayObj.pickedMeshObj) {
                this.registry.services.node.executePort(this.nodeObj, 'pickedMesh');
            }
        }
    }

    executeStop() {}
}

class RayLengthController extends PropController<string> {
    private nodeObj: NodeObj<RayCasterNodeParams>;

    constructor(nodeObj: NodeObj) {
        super();
        this.nodeObj = nodeObj;
    }

    acceptedProps() { return ['length']; }

    defaultVal() {
        return this.nodeObj.param.length.val;
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }

    blur(context: PropContext) {
        this.nodeObj.param.length = context.clearTempVal();
        context.registry.services.render.reRenderAll();
    }
}