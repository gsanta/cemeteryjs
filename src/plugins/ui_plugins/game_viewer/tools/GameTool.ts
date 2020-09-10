import { AbstractTool } from "../../../../core/plugins/tools/AbstractTool";
import { IKeyboardEvent } from "../../../../core/services/input/KeyboardService";
import { BuiltinNodeType } from "../../../../core/models/game_objects/NodeObj";
import { ToolType } from "../../../../core/plugins/tools/Tool";
import { Registry } from "../../../../core/Registry";
import { AbstractCanvasPlugin } from "../../../../core/plugins/AbstractCanvasPlugin";

export const GameToolType = 'game-tool';
export class GameTool extends AbstractTool {

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(GameToolType, plugin, registry);
    }

    keydown(e: IKeyboardEvent) {
        const nodes = this.registry.services.node.graph.getNodesByType(BuiltinNodeType.Keyboard)
            .filter(node => node.obj.getParam('key').val === String.fromCharCode(e.keyCode).toLocaleLowerCase())
            .forEach(node => node.obj.execute(this.registry));
    }
}