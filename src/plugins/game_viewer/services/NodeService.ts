import { NodeModel, NodeType } from '../../../core/stores/game_objects/NodeModel';
import { Registry } from '../../../core/Registry';
import { AbstractNodeHandler } from './node_handlers/AbstractNodeHandler';
import { KeyboardNodeHandler } from './node_handlers/KeyboardNodeHandler';
import { MoveNodeHandler } from './node_handlers/MoveNodeHandler';
import { SplitNodeHandler } from './node_handlers/SplitNodeHandler';
import { TurnNodeHandler } from './node_handlers/TurnNodeHandler';
import { RouteNodeHandler } from './node_handlers/RouteNodeHandler';
import { AbstractPluginService } from '../../common/AbstractPluginService';
import { GameViewerPlugin } from '../GameViewerPlugin';
import { AbstractCanvasPlugin } from '../../../core/plugins/AbstractCanvasPlugin';
import { EngineService } from '../../../core/services/EngineService';

export class NodeService extends AbstractPluginService<AbstractCanvasPlugin> {
    static serviceName = 'node-service';
    serviceName = NodeService.serviceName;
    handlersByType: Map<string, AbstractNodeHandler<NodeModel>> = new Map();

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(plugin, registry);
        this.handlersByType.set(NodeType.Keyboard, new KeyboardNodeHandler(plugin, registry));
        this.handlersByType.set(NodeType.Move, new MoveNodeHandler(plugin, registry));
        this.handlersByType.set(NodeType.Turn, new TurnNodeHandler(plugin, registry));
        this.handlersByType.set(NodeType.Split, new SplitNodeHandler(plugin, registry));
        this.handlersByType.set(NodeType.Route, new RouteNodeHandler(plugin, registry));
    }
    
    awake() {
        const engineService = this.plugin.pluginServices.byName<EngineService<any>>(EngineService.serviceName);
        engineService.getScene().registerAfterRender(() => {
            this.getNodesByType(NodeType.Route).forEach(node => {
                this.getHandler(node).update(node);
            });
    
            this.getNodesByType(NodeType.Keyboard).forEach(node => {
                this.getHandler(node).update(node);
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