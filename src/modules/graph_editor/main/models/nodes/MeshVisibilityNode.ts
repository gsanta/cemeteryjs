import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { Registry } from "../../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../../core/services/node/INodeExecutor";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { NodeParam, PortDirection, PortDataFlow, NodeParamJson } from "../../../../../core/models/objs/node_obj/NodeParam";
import { MeshVisibilityNodeControllers } from "../../controllers/nodes/MeshVisibilityNodeControllers";
import { NodeShape } from "../shapes/NodeShape";

export const MeshVisibilityNodeType = 'mesh-visibility-node-obj';

export class MeshVisibilityNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = MeshVisibilityNodeType;
    displayName = 'Mesh Visibility';
    category = 'Mesh';

    createView(obj: NodeObj): NodeShape {
        const nodeView = new NodeShape(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new MeshVisibilityNodeControllers(this.registry, obj));
        nodeView.id = this.registry.data.node.items.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        obj.setParams(new MeshVisibilityNodeParams());
        obj.id = this.registry.data.scene.items.generateId(obj);
        obj.graph = this.registry.data.helper.node.graph;
        // obj.executor = new MeshPropertyNodeExecutor(this.registry, obj);

        return obj;
    }
}

export class MeshVisibilityNodeParams extends NodeParams {    
    readonly 'signal on': NodeParam = {
        name: 'signal on',
        portDirection: PortDirection.Input,
        portDataFlow: PortDataFlow.Push,
        execute: () => {
            const meshObj = this.mesh.ownVal;

            if (meshObj) {
                meshObj.setVisibility(1);
            }
        }
    }

    readonly 'signal off': NodeParam = {
        name: 'signal off',
        portDirection: PortDirection.Input,
        portDataFlow: PortDataFlow.Push,
        execute() {
            const meshObj = this.mesh.val;

            if (meshObj) {
                meshObj.setVisibility(0);
            }
        }
    }

    readonly mesh: NodeParam<MeshObj> = {
        name: 'mesh',
        ownVal: undefined,
        portDirection: PortDirection.Input,
        portDataFlow: PortDataFlow.Pull,
        toJson: () => {
            return {
                name: this.mesh.name,
                val: this.mesh.ownVal ? this.mesh.ownVal.id : undefined
            }
        },
        fromJson: (registry: Registry, nodeParamJson: NodeParamJson) => {
            this.mesh.name = nodeParamJson.name;
            if (nodeParamJson.val) {
                this.mesh.ownVal = <MeshObj> registry.data.scene.items.getItemById(nodeParamJson.val);
            }
        }
    }
}

export class MeshVisibilityNodeExecutor extends AbstractNodeExecutor<MeshVisibilityNodeParams> {
    private registry: Registry;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(nodeObj);
        this.registry = registry;
    }

    execute() {
        const visibility: number = this.nodeObj.param.visible.ownVal;

        let meshObj: MeshObj = this.nodeObj.param.mesh.getPortOrOwnVal();

        if (meshObj) {
            meshObj.setVisibility(visibility);
        }
    }

    executeStop() {}
}