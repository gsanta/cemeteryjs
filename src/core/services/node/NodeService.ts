import { NodeModel, NodeType } from '../../models/nodes/NodeModel';
import { Registry } from '../../Registry';
import { AbstractNodeHandler } from './handlers/AbstractNodeHandler';
import { KeyboardNodeHandler } from './handlers/KeyboardNodeHandler';
import { MoveNodeHandler } from './handlers/MoveNodeHandler';
import { SplitNodeHandler } from './handlers/SplitNodeHandler';
import { TurnNodeHandler } from './handlers/TurnNodeHandler';
import { RouteNodeHandler } from './handlers/RouteNodeHandler';

export class NodeService {
    handlersByType: Map<string, AbstractNodeHandler<NodeModel>> = new Map();
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.handlersByType.set(NodeType.Keyboard, new KeyboardNodeHandler(registry));
        this.handlersByType.set(NodeType.Move, new MoveNodeHandler(registry));
        this.handlersByType.set(NodeType.Turn, new TurnNodeHandler(registry));
        this.handlersByType.set(NodeType.Split, new SplitNodeHandler(registry));
        this.handlersByType.set(NodeType.Route, new RouteNodeHandler(registry));

        this.registry.services.game.registerAfterRender(() => {
            this.registry.services.node.getNodesByType(NodeType.Route).forEach(node => {
                this.registry.services.node.getHandler(node).update(node);
            });

            this.registry.services.node.getNodesByType(NodeType.Keyboard).forEach(node => {
                this.registry.services.node.getHandler(node).update(node);
            });
        });
    }

    getHandler(node: NodeModel): AbstractNodeHandler<NodeModel> {
        return this.handlersByType.get(node.type);
    }

    getNodesByType<T extends NodeModel>(nodeType: string): T[] {
        return <T[]> this.registry.stores.nodeStore.nodesByType.get(nodeType) || [];
    }


}