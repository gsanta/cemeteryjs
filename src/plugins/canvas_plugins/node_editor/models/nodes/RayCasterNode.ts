import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, NodeParamJson, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { RayObj } from "../../../../../core/models/objs/RayObj";
import { Registry } from "../../../../../core/Registry";
import { RayCasterNodeControllers } from "../../controllers/nodes/RayCasterNodeControllers";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { NodeShape } from "../shapes/NodeShape";

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

    createView(obj: NodeObj): NodeShape {
        const nodeView = new NodeShape(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new RayCasterNodeControllers(this.registry, obj));
        nodeView.id = this.registry.data.shape.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj<RayCasterNodeParams> {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        const params = new RayCasterNodeParams(this.registry, obj);
        obj.setParams(params);
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;
        return obj;
    }
}

export class RayCasterNodeParams extends NodeParams {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();
        this.when = new WhenNodeParam(registry, nodeObj, this);
        this.helper = new HelperNodeParam(nodeObj);
        this.signal = new SignalNodeParam(nodeObj);
    }

    readonly mesh: NodeParam<MeshObj> = {
        name: 'mesh',
        ownVal: undefined,
        toJson: () => {
            return {
                name: this.mesh.name,
                val: this.mesh.ownVal ? this.mesh.ownVal.id : undefined
            }
        },
        fromJson: (registry: Registry, nodeParamJson: NodeParamJson) => {
            this.mesh.name = nodeParamJson.name;
            if (nodeParamJson.val) {
                this.mesh.ownVal = <MeshObj> registry.stores.objStore.getById(nodeParamJson.val);
            }
        }
    }
    
    readonly length: NodeParam = {
        name: 'length',
        ownVal: 100,
    }
    
    readonly ray: NodeParam = {
        name: 'ray',
        ownVal: new RayObj
    }
    
    readonly when: WhenNodeParam;
    readonly helper: HelperNodeParam;

    readonly signal: NodeParam;
    
    readonly pickedMesh: NodeParam = {
        name: 'pickedMesh',
        ownVal: undefined,
        portDirection: PortDirection.Output,
        portDataFlow: PortDataFlow.Pull
    }
}

class SignalNodeParam extends NodeParam {
    name = 'signal';
    portDirection = PortDirection.Output;
    portDataFlow = PortDataFlow.Push;
}

class WhenNodeParam extends NodeParam {
    private registry: Registry;
    private rayCasterNodeParams: RayCasterNodeParams;

    constructor(registry: Registry, nodeObj: NodeObj, rayCasterNodeParams: RayCasterNodeParams) {
        super(nodeObj);
        this.registry = registry;
        this.rayCasterNodeParams = rayCasterNodeParams;
    }

    name = 'when';
    portDirection = PortDirection.Input;
    portDataFlow = PortDataFlow.Push;

    execute() {
        const meshObj = this.nodeObj.param.mesh.val;

        if (meshObj) {
            const rayObj = this.nodeObj.param.ray.val;
            rayObj.meshObj = meshObj;
            rayObj.rayLength = this.nodeObj.param.length.val;
            this.registry.engine.rays.createInstance(rayObj);
            this.nodeObj.getPortForParam(this.rayCasterNodeParams.helper).push();

            if (rayObj.pickedMeshObj) {
                this.nodeObj.param.pickedMesh.val = rayObj.pickedMeshObj;
                this.nodeObj.getPortForParam(this.rayCasterNodeParams.signal).push();
            }
        }
    }
}

class HelperNodeParam extends NodeParam {
    name = 'helper';
    portDirection = PortDirection.Input;
    portDataFlow = PortDataFlow.Push;
}
