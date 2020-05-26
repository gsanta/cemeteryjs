import { NodeModel, SlotName, NodeType } from '../../../models/nodes/NodeModel';
import { Registry } from '../../../Registry';

export abstract class AbstractNodeHandler<T extends NodeModel> {
    nodeType: string;
    instance: T;

    protected registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    abstract handle(): void;

    protected chain(slotName: SlotName) {
        const joinedView = this.instance.nodeView.findJoinPointView(slotName).getOtherNode();
        const handler = this.registry.services.node.getHandler(joinedView.model);
        handler.instance = joinedView.model;
        handler.handle();
    }

    execute(node: T) {
        this.instance = node;
    }

    // protected getLeft(node: NodeModel, slotName: SlotName): AbstractNodeHandler {
    //     const otherNode = node.nodeView.findJoinPointView(slotName, false).getOtherNode();

    //     if (otherNode) {
    //         return this.registry.services.node.getHandler(otherNode.model);
    //     }
    // }

    searchFromRight<T extends NodeModel>(nodeType: NodeType): T {
        return undefined;
    }

    protected findNodeAtInputSlot<T extends NodeModel>(slotName: SlotName, nodeType: NodeType): T {
        const joinedView = this.instance.nodeView.findJoinPointView(slotName).getOtherNode();
        
        if (!joinedView) { return undefined; } 

        let node: T = undefined;

        if (joinedView.model.type === nodeType) {
            node = <T> joinedView.model;
        } else {
            const handler = this.registry.services.node.getHandler(joinedView.model);
            handler.instance = joinedView.model;
            node = handler.searchFromRight<T>(nodeType);
        }

        return node;
    }

    protected rightToLeft() {
        
    }

    update(node: T): void {
        this.instance = node;
    };
}