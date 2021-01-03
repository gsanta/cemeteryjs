import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDirection, PortDataFlow, NodeParamField, NodeParamJson } from "../../../../../core/models/objs/node_obj/NodeParam";
import { NodeView } from "../../../../../core/models/views/NodeView";
import { Registry } from "../../../../../core/Registry";
import { AbstractNodeFactory } from "../AbstractNode";
import { AnimationGroupNodeControllers } from "./AnimationGroupNodeControllers";

export const RemoveMeshNodeType = 'animation-group-node-obj';

export class AnimationGroupNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = RemoveMeshNodeType;
    displayName = 'Animation Group';
    category = 'Mesh';

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new AnimationGroupNodeControllers(this.registry, obj));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        obj.setParams(new AnimationGroupNodeParams(this.registry, obj));
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class AnimationGroupNodeParams extends NodeParams {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();

        this.signal = new SignalNode(registry, this, nodeObj);
    }

    readonly signal: NodeParam;

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
            this.mesh.val = <MeshObj> registry.stores.objStore.getById(nodeParamJson.val);
        },
        getVal() {
            return this.val;
        }
    }

    readonly animation: NodeParam<string> = {
        name: 'animation',
        field: NodeParamField.List,
        val: undefined,
        // port: {
        //     direction: PortDirection.Input,
        //     dataFlow: PortDataFlow.Pull
        // },
        toJson() {
            return {
                name: this.name,
                field: this.field,
                val: this.val
            }
        },
        fromJson(registry: Registry, nodeParamJson: NodeParamJson) {
            this.val = nodeParamJson.val;
        },
        getVal() {
            return this.mesh.val;
        }
    }
}

class SignalNode extends NodeParam {
    private registry: Registry;
    private params: AnimationGroupNodeParams;

    constructor(registry: Registry, params: AnimationGroupNodeParams, nodeObj: NodeObj) {
        super(nodeObj);
        this.registry = registry;
        this.params = params;
        this.nodeObj = nodeObj;
    }

    name = 'signal';
    port = {
        direction: PortDirection.Input,
        dataFlow: PortDataFlow.Push,
        execute: () => {
            const meshObj = this.params.mesh.getVal();
            const animation = this.params.animation.val;
            if (meshObj && animation) {
                this.registry.engine.animatons.startAnimation(meshObj, animation)
            }
        }
    }
}