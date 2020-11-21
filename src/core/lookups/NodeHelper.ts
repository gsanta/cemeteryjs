import { AbstractNode } from "../../plugins/canvas_plugins/node_editor/nodes/AbstractNode";
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
        return node.createView();
    }

    createObj(nodeType: string) {
        const node: AbstractNode = this.nodes.get(nodeType);
        return node.createObj();
    }

    getRegisteredNodeTypes(): string[] {
    return Array.from(this.nodes.keys());
    }

    getNode(nodeType: string): AbstractNode {
        return this.nodes.get(nodeType);
    }
}