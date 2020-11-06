import { NodeRenderer } from "../../plugins/canvas_plugins/node_editor/NodeRenderer";
import { AbstractNode } from "../../plugins/canvas_plugins/node_editor/nodes/AbstractNode";
import { NodeObj } from "../models/objs/NodeObj";
import { NodeView } from "../models/views/NodeView";
import { Registry } from "../Registry";
import { NodeGraph } from "../services/node/NodeGraph";


export class NodeHelper {
    private registry: Registry;

    private nodes: Map<string, AbstractNode> = new Map();

    // TODO consider putting it into NodeObj
    graph: NodeGraph;

    constructor(registry: Registry) {
        this.registry = registry;
        this.graph = new NodeGraph(registry);
    }

    registerNode(node: AbstractNode) {
        this.nodes.set(node.nodeType, node);
    }

    createView(nodeType: string) {
        const node: AbstractNode = this.nodes.get(nodeType);

        const nodeView = new NodeView();
        nodeView.controller = node.getController();
        nodeView.renderer = new NodeRenderer(nodeView);

        return nodeView;
    }

    createObj(nodeType: string) {
        const node: AbstractNode = this.nodes.get(nodeType);

        const obj = new NodeObj(nodeType, {displayName: node.displayName});
        
        obj.addAllParams(node.getParams());
        obj.inputs = node.getInputLinks();
        obj.outputs = node.getOutputLinks();
        obj.executor = node.getExecutor();
        obj.id = this.registry.stores.objStore.generateId(obj);

        return obj;
    }

    getRegisteredNodeTypes(): string[] {
        return Array.from(this.nodes.keys());
    }

    getNode(nodeType: string): AbstractNode {
        return this.nodes.get(nodeType);
    }
}