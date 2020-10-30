import { NullTool } from "../../../../core/plugin/tools/NullTool";
import { IKeyboardEvent } from "../../../../core/services/input/KeyboardService";
import { Registry } from "../../../../core/Registry";
import { KeyboardNodeType } from "../../node_editor/nodes/KeyboardNodeObj";
import { UI_Plugin } from '../../../../core/plugin/UI_Plugin';

export const GameToolId = 'game-tool';
export class GameTool extends NullTool {
    // TODO: not a good place for it
    lastExecutedKey: string;

    constructor(plugin: UI_Plugin, registry: Registry) {
        super(GameToolId, plugin, registry);
    }

    keydown(e: IKeyboardEvent) {
        this.lastExecutedKey = String.fromCharCode(e.keyCode).toLocaleLowerCase();
        this.registry.services.node.graph.getNodesByType(KeyboardNodeType)
            .forEach(node => this.registry.services.node.executeNode(node.getObj()));
    }
}