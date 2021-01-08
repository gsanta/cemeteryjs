import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { Registry } from "../../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../../core/services/node/INodeExecutor";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { NodeParam, PortDirection, PortDataFlow, NodeParamField, NodeParamJson } from "../../../../../core/models/objs/node_obj/NodeParam";
import { MeshVisibilityNodeControllers } from "../../controllers/nodes/MeshVisibilityNodeControllers";
import { NodeView } from "../views/NodeView";

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

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new MeshVisibilityNodeControllers(this.registry, obj));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        obj.setParams(new MeshVisibilityNodeParams());
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;
        // obj.executor = new MeshPropertyNodeExecutor(this.registry, obj);

        return obj;
    }
}

export class MeshVisibilityNodeParams extends NodeParams {    
    readonly 'signal on': NodeParam = {
        name: 'signal on',
        port: {
            direction: PortDirection.Input,
            dataFlow: PortDataFlow.Push
        },
        execute: () => {
            const meshObj = this.mesh.val;

            if (meshObj) {
                meshObj.setVisibility(1);
            }
        }
    }

    readonly 'signal off': NodeParam = {
        name: 'signal off',
        port: {
            direction: PortDirection.Input,
            dataFlow: PortDataFlow.Push,
        },
        execute() {
            const meshObj = this.mesh.val;

            if (meshObj) {
                meshObj.setVisibility(0);
            }
        }
    }

    readonly mesh: NodeParam<MeshObj> = {
        name: 'mesh',
        field: NodeParamField.List,
        val: undefined,
        port: {
            direction: PortDirection.Input,
            dataFlow: PortDataFlow.Pull
        },
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
}

export class MeshVisibilityNodeExecutor extends AbstractNodeExecutor<MeshVisibilityNodeParams> {
    private registry: Registry;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(nodeObj);
        this.registry = registry;
    }

    execute() {
        const visibility: number = this.nodeObj.param.visible.val;

        let meshObj: MeshObj;
        if (this.nodeObj.getPort('mesh').hasConnectedPort()) {
            meshObj = this.nodeObj.pullData('mesh');
        } else {
            meshObj =  this.nodeObj.param.mesh.val;
        }

        if (meshObj) {
            meshObj.setVisibility(visibility);
        }
    }

    executeStop() {}
}