import { NullTool } from "../../../../core/plugin/tools/NullTool";
import { IKeyboardEvent } from "../../../../core/services/input/KeyboardService";
import { Registry } from "../../../../core/Registry";
import { KeyboardNodeType } from "../../node_editor/nodes/KeyboardNodeObj";
import { AbstractCanvasPanel } from "../../../../core/plugin/AbstractCanvasPanel";

export const GameToolId = 'game-tool';
export class GameTool extends NullTool {
    // TODO: not a good place for it
    lastExecutedKey: string;

    constructor(panel: AbstractCanvasPanel, registry: Registry) {
        super(GameToolId, panel, registry);
    }

    keydown(e: IKeyboardEvent) {
        this.lastExecutedKey = String.fromCharCode(e.keyCode).toLocaleLowerCase();
        this.registry.data.helper.node.graph.getNodesByType(KeyboardNodeType).forEach(node => node.getObj().execute());
    }
}