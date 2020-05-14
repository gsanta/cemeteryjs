import { CanvasView } from "./scene_editor/CanvasView";
import { GameView } from "./game_viewer/GameView";
import { ActionEditorView } from "./action_editor/ActionEditorView";
import { Registry } from "../core/Registry";
import { View } from "../core/View";

export class Views {
    sceneEditorView: CanvasView;
    gameView: GameView;
    actionEditorView: ActionEditorView;

    views: View[];

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.sceneEditorView = new CanvasView(registry);
        this.gameView = new GameView(registry);
        this.actionEditorView = new ActionEditorView(registry);

        this.views = [
            this.sceneEditorView,
            this.gameView,
            this.actionEditorView
        ]
    }

    getActiveView() {
        return this.registry.services.layout.getHoveredView();
    }
}