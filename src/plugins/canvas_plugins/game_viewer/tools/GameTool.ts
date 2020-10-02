import { NullTool } from "../../../../core/plugin/tools/NullTool";
import { IKeyboardEvent } from "../../../../core/services/input/KeyboardService";
import { Registry } from "../../../../core/Registry";
import { AbstractCanvasPlugin } from "../../../../core/plugin/AbstractCanvasPlugin";
import { KeyboardNodeType } from "../../node_editor/nodes/KeyboardNodeObj";

export const GameToolType = 'game-tool';
export class GameTool extends NullTool {
    // TODO: not a good place for it
    lastExecutedKey: string;

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(GameToolType, plugin, registry);
    }

    keydown(e: IKeyboardEvent) {
        this.lastExecutedKey = String.fromCharCode(e.keyCode).toLocaleLowerCase();
        this.registry.services.node.graph.getNodesByType(KeyboardNodeType)
            .forEach(node => node.getObj().execute(this.registry));
    }
}