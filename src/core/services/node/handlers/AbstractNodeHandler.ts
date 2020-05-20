import { AbstractNode } from '../../../models/views/nodes/AbstractNode';
import { Registry } from '../../../Registry';


export abstract class AbstractNodeHandler {
    nodeType: string;

    protected registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    abstract handle(node: AbstractNode): void;

    protected chain(node: AbstractNode, slotName: string) {
        const otherNode = node.nodeView.findJoinPointView(slotName, false).getOtherNode();
        this.registry.services.node.getHandler(otherNode.node).handle(otherNode.node);
    }
}