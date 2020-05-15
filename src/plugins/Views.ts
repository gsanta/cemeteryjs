import { SceneEditorPlugin } from "./scene_editor/SceneEditorPlugin";
import { GameViewerPlugin } from "./game_viewer/GameViewerPlugin";
import { ActionEditorPlugin } from "./action_editor/ActionEditorPlugin";
import { Registry } from "../core/Registry";
import { AbstractPlugin } from "../core/AbstractPlugin";

export class Views {
    sceneEditorView: SceneEditorPlugin;
    gameView: GameViewerPlugin;
    actionEditorView: ActionEditorPlugin;

    views: AbstractPlugin[];

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.sceneEditorView = new SceneEditorPlugin(registry);
        this.gameView = new GameViewerPlugin(registry);
        this.actionEditorView = new ActionEditorPlugin(registry);

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