import { AbstractTool } from "../../../../../core/controller/tools/AbstractTool";
import { IKeyboardEvent } from "../../../../../core/controller/KeyboardHandler";
import { Registry } from "../../../../../core/Registry";
import { KeyboardNodeType } from "../../../../graph_editor/main/models/nodes/KeyboardNode";
import { AbstractCanvasPanel, InteractionMode } from "../../../../../core/models/modules/AbstractCanvasPanel";
import { IObj } from "../../../../../core/models/objs/IObj";

export const GameToolId = 'game-tool';
export class GameTool extends AbstractTool<IObj> {
    // TODO: not a good place for it
    lastExecutedKey: string;

    constructor(panel: AbstractCanvasPanel<IObj>, registry: Registry) {
        super(GameToolId, panel, registry);
    }

    keydown(e: IKeyboardEvent) {
        if (this.canvas.interactionMode === InteractionMode.Execution) {
            this.lastExecutedKey = String.fromCharCode(e.keyCode).toLocaleLowerCase();
            this.registry.data.helper.node.graph.getNodesByType(KeyboardNodeType).forEach(node => node.getObj().execute());
            this.registry.services.game.executeKeyDown(e);
        }
    }

    keyup(e: IKeyboardEvent) {
        if (this.canvas.interactionMode === InteractionMode.Execution) {
            // this.lastExecutedKey = String.fromCharCode(e.keyCode).toLocaleLowerCase();
            // this.registry.data.helper.node.graph.getNodesByType(KeyboardNodeType).forEach(node => node.getObj().execute());
            this.registry.services.game.executeKeyUp(e);
        }
    }
}