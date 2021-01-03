import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, NodeParamField, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { NodeView } from "../../../../../core/models/views/NodeView";
import { Registry } from "../../../../../core/Registry";
import { AbstractNodeFactory } from "../AbstractNode";
import { AnimationNodeControllers } from "./AnimationNodeControllers";

export const AnimationNodeType = 'animation-node-obj';

export class AnimationNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = AnimationNodeType;
    displayName = 'Animation';
    category = 'Default';

    
    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new AnimationNodeControllers(this.registry, nodeView.getObj()));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        obj.setParams(new AnimationNodeParams());
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class AnimationNodeParams extends NodeParams {
    readonly mesh: NodeParam = {
        name: 'mesh',
        field: NodeParamField.List,
        val: '',
    }

    readonly startFrame: NodeParam = {
        name: 'startFrame',
        field: NodeParamField.NumberField,
        val: 0,
    }
    
    readonly endFrame: NodeParam = {
        name: 'endFrame',
        field: NodeParamField.NumberField,
        val: 0,
    }
    
    readonly action: NodeParam = {
        name: 'action',
        port: {
            direction: PortDirection.Output,
            dataFlow: PortDataFlow.Push
        }
    }
}