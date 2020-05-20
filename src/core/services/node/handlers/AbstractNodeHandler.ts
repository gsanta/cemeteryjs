import { NodeModel } from '../../../models/views/nodes/NodeModel';
import { Registry } from '../../../Registry';


export abstract class AbstractNodeHandler {
    nodeType: string;

    protected registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    abstract handle(node: NodeModel): void;

    protected chain(node: NodeModel, slotName: string) {
        const otherNode = node.nodeView.findJoinPointView(slotName, false).getOtherNode();
        this.registry.services.node.getHandler(otherNode.model).handle(otherNode.model);
    }
}