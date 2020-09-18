import { AbstractTool } from "../../../../core/plugins/tools/AbstractTool";
import { IKeyboardEvent } from "../../../../core/services/input/KeyboardService";
import { BuiltinNodeType } from "../../../../core/models/game_objects/NodeObj";
import { Registry } from "../../../../core/Registry";
import { AbstractCanvasPlugin } from "../../../../core/plugins/AbstractCanvasPlugin";

export const GameToolType = 'game-tool';
export class GameTool extends AbstractTool {
    // TODO: not a good place for it
    lastExecutedKey: string;

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(GameToolType, plugin, registry);
    }

    keydown(e: IKeyboardEvent) {
        this.lastExecutedKey = String.fromCharCode(e.keyCode).toLocaleLowerCase();
        this.registry.services.node.graph.getNodesByType(BuiltinNodeType.Keyboard)
            .forEach(node => node.obj.execute(this.registry));
    }
}