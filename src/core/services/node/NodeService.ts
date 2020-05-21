import { NodeModel, NodeType } from '../../models/views/nodes/NodeModel';
import { Registry } from '../../Registry';
import { AbstractNodeHandler } from './handlers/AbstractNodeHandler';
import { KeyboardNodeHandler } from './handlers/KeyboardNodeHandler';
import { MoveNodeHandler } from './handlers/MoveNodeHandler';
import { SplitNodeHandler } from './handlers/SplitNodeHandler';
import { TurnNodeHandler } from './handlers/TurnNodeHandler';

export class NodeService {
    handlersByType: Map<string, AbstractNodeHandler> = new Map();
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.handlersByType.set(NodeType.Keyboard, new KeyboardNodeHandler(registry));
        this.handlersByType.set(NodeType.Move, new MoveNodeHandler(registry));
        this.handlersByType.set(NodeType.Turn, new TurnNodeHandler(registry));
        this.handlersByType.set(NodeType.Split, new SplitNodeHandler(registry));

        this.registry.services.game.registerAfterRender(() => {
            this.handlersByType.get(NodeType.Keyboard).update();
        });
    }

    getHandler(node: NodeModel): AbstractNodeHandler {
        return this.handlersByType.get(node.type);
    }

    getNodesByType<T extends NodeModel>(nodeType: string): T[] {
        return <T[]> this.registry.stores.nodeStore.nodesByType.get(nodeType) || [];
    }


}