import { NodeGraph } from './NodeGraph';
import { AbstractNode } from '../../models/views/nodes/AbstractNode';
import { AbstractNodeHandler } from './handlers/AbstractNodeHandler';

export class NodeService {
    graph: NodeGraph;
    nodesByType: Map<string, AbstractNode[]> = new Map();
    handlersByType: Map<string, AbstractNodeHandler> = new Map();

    getHandler(node: AbstractNode): AbstractNodeHandler {
        return this.handlersByType.get(node.type);
    }

    getNodesByType<T extends AbstractNode>(nodeType: string): T[] {
        return <T[]> this.nodesByType.get(nodeType);
    }
}