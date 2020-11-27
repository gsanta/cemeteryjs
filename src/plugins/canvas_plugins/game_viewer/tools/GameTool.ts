import { ToolAdapter } from "../../../../core/plugin/tools/ToolAdapter";
import { IKeyboardEvent } from "../../../../core/services/input/KeyboardService";
import { Registry } from "../../../../core/Registry";
import { KeyboardNodeType } from "../../node_editor/nodes/KeyboardNode";
import { AbstractCanvasPanel } from "../../../../core/plugin/AbstractCanvasPanel";

export const GameToolId = 'game-tool';
export class GameTool extends ToolAdapter {
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