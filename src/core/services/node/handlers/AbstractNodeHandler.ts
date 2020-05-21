import { NodeModel, SlotName } from '../../../models/views/nodes/NodeModel';
import { Registry } from '../../../Registry';


export abstract class AbstractNodeHandler {
    nodeType: string;

    protected registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    abstract handle(node: NodeModel): void;

    protected chain(node: NodeModel, slotName: SlotName) {
        const otherNode = node.nodeView.findJoinPointView(slotName, false).getOtherNode();
        this.registry.services.node.getHandler(otherNode.model).handle(otherNode.model);
    }

    protected chainLeft(node: NodeModel, slotName: SlotName) {
        const otherNode = node.nodeView.findJoinPointView(slotName, false).getOtherNode();

        if (otherNode) {
            this.registry.services.node.getHandler(otherNode.model).handle(otherNode.model);
        }
    }

    protected getLeft(node: NodeModel, slotName: SlotName): AbstractNodeHandler {
        const otherNode = node.nodeView.findJoinPointView(slotName, false).getOtherNode();

        if (otherNode) {
            return this.registry.services.node.getHandler(otherNode.model);
        }
    }

    protected rightToLeft() {
        
    }

    update(): void {};
}