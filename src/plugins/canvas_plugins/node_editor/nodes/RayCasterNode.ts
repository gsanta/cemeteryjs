import { MeshObj } from "../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, NodeParamField, PortDirection, PortDataFlow } from "../../../../core/models/objs/node_obj/NodeParam";
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

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamController(new MeshController(this.registry, nodeView.getObj()), new RayLengthController(this.registry, nodeView.getObj()));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj<RayCasterNodeParams> {
        const obj = new NodeObj(this.nodeType, new RayCasterNodeParams(), {displayName: this.displayName});
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.executor = new RayCasterNodeExecutor(this.registry, obj);
        obj.graph = this.registry.data.helper.node.graph;
        return obj;
    }
}

export class RayCasterNodeParams extends NodeParams {
    readonly mesh: NodeParam<MeshObj> = {
        name: 'mesh',
        field: NodeParamField.List,
        val: undefined,

    }
    
    readonly length: NodeParam = {
        name: 'length',
        field: NodeParamField.NumberField,
        val: 100,
    }
    
    readonly ray: NodeParam = {
        name: 'ray',
        val: new RayObj
    }
    
    readonly when: NodeParam = {
        name: 'when',
        port: {
            direction: PortDirection.Input,
            dataFlow: PortDataFlow.Push
        }
    }
    
    readonly helper: NodeParam = {
        name: 'helper',
        port: {
            direction: PortDirection.Input,
            dataFlow: PortDataFlow.Push
        }
    }

    readonly signal: NodeParam = {
        name: 'signal',
        port: {
            direction: PortDirection.Output,
            dataFlow: PortDataFlow.Push
        }
    }
    
    readonly pickedMesh: NodeParam = {
        name: 'pickedMesh',
        val: undefined,
        port: {
            direction: PortDirection.Output,
            dataFlow: PortDataFlow.Pull
        }
    }
}

export class RayCasterNodeExecutor extends AbstractNodeExecutor<RayCasterNodeParams> {
    private registry: Registry;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(nodeObj);
        this.registry = registry;
    }

    execute() {
        const meshObj = this.nodeObj.param.mesh.val;

        if (meshObj) {
            const rayObj = this.nodeObj.param.ray.val;
            rayObj.meshObj = meshObj;
            rayObj.rayLength = this.nodeObj.param.length.val;
            this.registry.engine.rays.createInstance(rayObj);
            this.registry.services.node.executePort(this.nodeObj, 'helper');

            if (rayObj.pickedMeshObj) {
                this.nodeObj.param.pickedMesh.val = rayObj.pickedMeshObj;
                this.registry.services.node.executePort(this.nodeObj, 'signal');
            }
        }
    }
}

class RayLengthController extends PropController<string> {
    private nodeObj: NodeObj<RayCasterNodeParams>;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
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
        this.nodeObj.param.length.val = context.clearTempVal();
        context.registry.services.render.reRenderAll();
    }
}