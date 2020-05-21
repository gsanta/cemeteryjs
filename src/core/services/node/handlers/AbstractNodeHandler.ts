import { NodeModel, SlotName, NodeType } from '../../../models/views/nodes/NodeModel';
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
        const joinedView = this.instance.nodeView.findJoinPointView(slotName, false).getOtherNode();
        const handler = this.registry.services.node.getHandler(joinedView.model);
        handler.instance = joinedView.model;
        handler.handle();
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

    protected rightToLeft() {
        
    }

    update(): void {};
}