import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, NodeParamField, PortDirection, PortDataFlow, NodeParamJson } from "../../../../../core/models/objs/node_obj/NodeParam";
import { NodeView } from "../../../../../core/models/views/NodeView";
import { Registry } from "../../../../../core/Registry";
import { INodeListener } from "../../node/INodeListener";
import { AbstractNodeFactory } from "../AbstractNode";
import { TriggerZoneNodeControllers } from "./TriggerZoneNodeControllers";

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

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new TriggerZoneNodeControllers(this.registry, nodeView.getObj()));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj<TriggerZoneNodeParams>(this.nodeType, {displayName: this.displayName});
        obj.setParams(new TriggerZoneNodeParams());
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;
        
        return obj;
    }
}

export class TriggerZoneNodeParams extends NodeParams {
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

    readonly pickableMesh: NodeParam = {
        name: 'pickableMesh',
        port: {
            direction: PortDirection.Input,
            dataFlow: PortDataFlow.Pull,
        }
    }
    
    readonly signal: NodeParam = {
        name: 'signal',
        port: {
            direction: PortDirection.Output,
            dataFlow: PortDataFlow.Push,
        },
        listener: new MeshIntersectionListener(this)
    }
}

class MeshIntersectionListener implements INodeListener {
    private lastIntersectedMesh: MeshObj;
    private nodeParams: TriggerZoneNodeParams;

    constructor(nodeParams: TriggerZoneNodeParams) {
        this.nodeParams = nodeParams;
    }

    onBeforeRender(nodeObj: NodeObj, registry: Registry) {
        const lastIntersectedMesh = this.lastIntersectedMesh;
        this.lastIntersectedMesh = undefined;
        
        const triggerZoneMeshObj = this.nodeParams.mesh.val;
        const pickableMeshObj = this.getPickableMesh(nodeObj, registry);
        const intersection = this.checkIntersection(triggerZoneMeshObj, pickableMeshObj);

        if (intersection) {
            this.lastIntersectedMesh = pickableMeshObj;
        }

        if (this.lastIntersectedMesh && lastIntersectedMesh !== this.lastIntersectedMesh) {
            this.nodeParams.signal.callConnectedPorts();
        }
    }

    private getPickableMesh(nodeObj: NodeObj, registry: Registry): MeshObj {
        if (nodeObj.getPort('pickableMesh').hasConnectedPort()) {
            return nodeObj.pullData('pickableMesh');
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