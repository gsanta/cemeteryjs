import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDirection, PortDataFlow, NodeParamJson } from "../../../../../core/models/objs/node_obj/NodeParam";
import { NodeShape } from "../shapes/NodeShape";
import { Registry } from "../../../../../core/Registry";
import { AbstractNodeListener, INodeListener } from "../../api/INodeListener";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { TriggerZoneNodeControllers } from "../../controllers/nodes/TriggerZoneNodeControllers";

export const TriggerZoneNodeType = 'trigger-zone-node-obj';

export class TriggerZoneNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = TriggerZoneNodeType;
    displayName = 'Trigger Zone';
    category = 'Trigger';

    createView(obj: NodeObj): NodeShape {
        const nodeView = new NodeShape(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new TriggerZoneNodeControllers(this.registry, nodeView.getObj()));
        nodeView.id = this.registry.data.shape.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj<TriggerZoneNodeParams>(this.nodeType, {displayName: this.displayName});
        obj.setParams(new TriggerZoneNodeParams(obj));
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;
        
        return obj;
    }
}

export class TriggerZoneNodeParams extends NodeParams {

    constructor(nodeObj: NodeObj) {
        super();

        this.signal = new SignalNodeObj(nodeObj, this);
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

    readonly pickableMesh: NodeParam = {
        name: 'pickableMesh',
        portDirection: PortDirection.Input,
        portDataFlow: PortDataFlow.Pull,
    }
    
    readonly signal: NodeParam;
}

class SignalNodeObj extends NodeParam {

    constructor(nodeObj: NodeObj, params: TriggerZoneNodeParams) {
        super(nodeObj);

        this.listener = new MeshIntersectionListener(params);
    }

    name = 'signal';
    portDirection = PortDirection.Output;
    portDataFlow = PortDataFlow.Push;

    listener: MeshIntersectionListener;
}

class MeshIntersectionListener extends AbstractNodeListener {
    private lastIntersectedMesh: MeshObj;
    private nodeParams: TriggerZoneNodeParams;

    constructor(nodeParams: TriggerZoneNodeParams) {
        super();
        this.nodeParams = nodeParams;
    }

    onBeforeRender(nodeObj: NodeObj, registry: Registry) {
        const lastIntersectedMesh = this.lastIntersectedMesh;
        this.lastIntersectedMesh = undefined;
        
        const triggerZoneMeshObj = this.nodeParams.mesh.ownVal;
        const pickableMeshObj = this.getPickableMesh(nodeObj, registry);
        const intersection = this.checkIntersection(triggerZoneMeshObj, pickableMeshObj);

        if (intersection) {
            this.lastIntersectedMesh = pickableMeshObj;
        }

        if (this.lastIntersectedMesh && lastIntersectedMesh !== this.lastIntersectedMesh) {
            nodeObj.getPortForParam(this.nodeParams.signal).push();
        }
    }

    private getPickableMesh(nodeObj: NodeObj, registry: Registry): MeshObj {
        if (nodeObj.getPort('pickableMesh').hasConnectedPort()) {
            return this.nodeParams.pickableMesh.getPortOrOwnVal();
        }
    }

    private checkIntersection(triggerZoneMeshObj: MeshObj, pickableMeshObj: MeshObj): boolean {
        if (triggerZoneMeshObj && pickableMeshObj) {
            if (triggerZoneMeshObj.intersectsMeshObj(pickableMeshObj)) {
                return true;
            }
        }
        return false;
    }
}