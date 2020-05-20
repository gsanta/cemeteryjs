import { NodeGraph } from './NodeGraph';
import { NodeModel } from '../../models/views/nodes/NodeModel';
import { AbstractNodeHandler } from './handlers/AbstractNodeHandler';

export class NodeService {
    graph: NodeGraph;
    nodesByType: Map<string, NodeModel[]> = new Map();
    handlersByType: Map<string, AbstractNodeHandler> = new Map();

    getHandler(node: NodeModel): AbstractNodeHandler {
        return this.handlersByType.get(node.type);
    }

    getNodesByType<T extends NodeModel>(nodeType: string): T[] {
        return <T[]> this.nodesByType.get(nodeType);
    }
}