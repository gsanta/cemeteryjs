import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, NodeParamField, NodeParamJson, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { RayObj } from "../../../../../core/models/objs/RayObj";
import { NodeView } from "../../../../../core/models/views/NodeView";
import { Registry } from "../../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../../core/services/node/INodeExecutor";
import { AbstractNodeFactory } from "../AbstractNode";
import { RayCasterNodeControllers } from "./RayCasterNodeControllers";

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
        nodeView.addParamControllers(new RayCasterNodeControllers(this.registry, obj));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj<RayCasterNodeParams> {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        const params = new RayCasterNodeParams();
        obj.setParams(params);
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.executor = new RayCasterNodeExecutor(this.registry, params, obj);
        obj.graph = this.registry.data.helper.node.graph;
        return obj;
    }
}

export class RayCasterNodeParams extends NodeParams {
    readonly mesh: NodeParam<MeshObj> = {
        name: 'mesh',
        field: NodeParamField.List,
        val: undefined,
        toJson: () => {
            return {
                name: this.mesh.name,
                field: this.mesh.field,
                val: this.mesh.val ? this.mesh.val.id : undefined
            }
        },
        fromJson: (registry: Registry, nodeParamJson: NodeParamJson) => {
            this.mesh.name = nodeParamJson.name;
            this.mesh.field = nodeParamJson.field;
            if (nodeParamJson.val) {
                this.mesh.val = <MeshObj> registry.stores.objStore.getById(nodeParamJson.val);
            }
        }
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
    private rayCasterNodeParams: RayCasterNodeParams;

    constructor(registry: Registry, rayCasterNodeParams: RayCasterNodeParams, nodeObj: NodeObj) {
        super(nodeObj);
        this.registry = registry;
        this.rayCasterNodeParams = rayCasterNodeParams;
    }

    execute() {
        const meshObj = this.nodeObj.param.mesh.val;

        if (meshObj) {
            const rayObj = this.nodeObj.param.ray.val;
            rayObj.meshObj = meshObj;
            rayObj.rayLength = this.nodeObj.param.length.val;
            this.registry.engine.rays.createInstance(rayObj);
            this.rayCasterNodeParams.helper.callConnectedPorts();

            if (rayObj.pickedMeshObj) {
                this.nodeObj.param.pickedMesh.val = rayObj.pickedMeshObj;
                this.rayCasterNodeParams.signal.callConnectedPorts();
            }
        }
    }
}