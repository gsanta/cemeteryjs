import { NodeGraph } from './NodeGraph';
import { AbstractNode } from '../../models/views/nodes/AbstractNode';
import { NodeHandler } from './handlers/NodeHandler';

export class NodeService {
    graph: NodeGraph;
    nodesByType: Map<string, AbstractNode[]> = new Map();
    handlersByType: Map<string, NodeHandler> = new Map();

    getHandler(node: AbstractNode): NodeHandler {
        return this.handlersByType.get(node.type);
    }
}