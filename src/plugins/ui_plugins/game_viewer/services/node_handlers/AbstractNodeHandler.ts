import { AbstractCanvasPlugin } from '../../../../../core/plugins/AbstractCanvasPlugin';
import { NodeObj, BuiltinNodeType, SlotName } from '../../../../../core/models/game_objects/NodeObj';
import { Registry } from '../../../../../core/Registry';
import { NodeService } from '../NodeService';

export abstract class AbstractNodeHandler<T extends NodeObj = NodeObj> {
    nodeType: string;
    instance: T;

    protected registry: Registry;
    plugin: AbstractCanvasPlugin;

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        this.registry = registry;
        this.plugin = plugin;
    }

    abstract handle(): void;

    protected chain(slotName: SlotName) {
        const joinedView = this.instance.nodeView.findJoinPointView(slotName).getOtherNode();
        const handler = this.getNodeService().getHandler(joinedView.obj);
        handler.instance = joinedView.obj;
        handler.handle();
    }

    wake(node: T) {
        this.instance = node;
    }

    update(node: T): void {
        this.instance = node;
    }

    // protected getLeft(node: NodeModel, slotName: SlotName): AbstractNodeHandler {
    //     const otherNode = node.nodeView.findJoinPointView(slotName, false).getOtherNode();

    //     if (otherNode) {
    //         return this.registry.services.node.getHandler(otherNode.model);
    //     }
    // }

    searchFromRight<T extends NodeObj>(nodeType: BuiltinNodeType): T {
        return undefined;
    }

    protected findNodeAtInputSlot<T extends NodeObj>(slotName: SlotName, nodeType: BuiltinNodeType): T {
        const joinedView = this.instance.nodeView.findJoinPointView(slotName).getOtherNode();
        
        if (!joinedView) { return undefined; } 

        let node: T = undefined;

        if (joinedView.obj.type === nodeType) {
            node = <T> joinedView.obj;
        } else {
            const handler = this.getNodeService().getHandler(joinedView.obj);
            handler.instance = joinedView.obj;
            node = handler.searchFromRight<T>(nodeType);
        }

        return node;
    }

    protected rightToLeft() {
        
    }

    protected getNodeService() {
        return this.plugin.pluginServices.byName<NodeService>(NodeService.serviceName);
    }
}