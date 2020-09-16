import { BuiltinNodeType, NodeObj } from '../../../../core/models/game_objects/NodeObj';
import { AbstractCanvasPlugin } from '../../../../core/plugins/AbstractCanvasPlugin';
import { AbstractPluginService } from '../../../../core/plugins/AbstractPluginService';
import { Registry } from '../../../../core/Registry';
import { AbstractNodeHandler } from './node_handlers/AbstractNodeHandler';
import { KeyboardNodeHandler } from './node_handlers/KeyboardNodeHandler';
import { MoveNodeHandler } from './node_handlers/MoveNodeHandler';
import { SplitNodeHandler } from './node_handlers/SplitNodeHandler';
import { TurnNodeHandler } from './node_handlers/TurnNodeHandler';

// TODO remove
export class NodeService extends AbstractPluginService<AbstractCanvasPlugin> {
    static serviceName = 'node-service';
    serviceName = NodeService.serviceName;
    handlersByType: Map<string, AbstractNodeHandler<NodeObj>> = new Map();

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(plugin, registry);
        this.handlersByType.set(BuiltinNodeType.Keyboard, new KeyboardNodeHandler(plugin, registry));
        this.handlersByType.set(BuiltinNodeType.Move, new MoveNodeHandler(plugin, registry));
        this.handlersByType.set(BuiltinNodeType.Turn, new TurnNodeHandler(plugin, registry));
        this.handlersByType.set(BuiltinNodeType.Split, new SplitNodeHandler(plugin, registry));
    }
    
    awake() {
        // const engineService = this.plugin.pluginServices.byName<EngineService<any>>(EngineService.serviceName);
        // engineService.getScene().registerAfterRender(() => {
        //     this.getNodesByType(BuiltinNodeType.Route).forEach(node => {
        //         this.getHandler(node).update(node);
        //     });
    
        //     this.getNodesByType(BuiltinNodeType.Keyboard).forEach(node => {
        //         this.getHandler(node).update(node);
        //     });
        // });

    }

    getHandler(node: NodeObj): AbstractNodeHandler<NodeObj> {
        return this.handlersByType.get(node.type);
    }
}