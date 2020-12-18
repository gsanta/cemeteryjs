import { AbstractNodeFactory } from "../../plugins/canvas_plugins/node_editor/nodes/AbstractNode";
import { NodeObj } from "../models/objs/node_obj/NodeObj";
import { Registry } from "../Registry";
import { NodeGraph } from "../services/node/NodeGraph";


export class NodeHelper {
    private registry: Registry;

    private nodes: Map<string, AbstractNodeFactory> = new Map();

    // TODO consider putting it into NodeObj
    graph: NodeGraph;

    constructor(registry: Registry) {
        this.registry = registry;
        this.graph = new NodeGraph(registry);
    }

    registerNode(node: AbstractNodeFactory) {
        this.nodes.set(node.nodeType, node);
    }

    createView(nodeType: string, obj: NodeObj) {
        const node: AbstractNodeFactory = this.nodes.get(nodeType);
        return node.createView(obj);
    }

    createObj(nodeType: string) {
        const node: AbstractNodeFactory = this.nodes.get(nodeType);
        return node.createObj();
    }

    getRegisteredNodeTypes(): string[] {
    return Array.from(this.nodes.keys());
    }

    getNode(nodeType: string): AbstractNodeFactory {
        return this.nodes.get(nodeType);
    }
}