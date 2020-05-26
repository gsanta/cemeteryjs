import { SceneEditorPlugin } from "./scene_editor/SceneEditorPlugin";
import { GameViewerPlugin } from "./game_viewer/GameViewerPlugin";
import { NodeEditorPlugin } from "./node_editor/NodeEditorPlugin";
import { Registry } from "../core/Registry";
import { AbstractPlugin } from "../core/AbstractPlugin";

export class Views {
    sceneEditorView: SceneEditorPlugin;
    gameView: GameViewerPlugin;
    nodeEditor: NodeEditorPlugin;

    views: AbstractPlugin[];

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.sceneEditorView = new SceneEditorPlugin(registry);
        this.gameView = new GameViewerPlugin(registry);
        this.nodeEditor = new NodeEditorPlugin(registry);

        this.views = [
            this.sceneEditorView,
            this.gameView,
            this.nodeEditor
        ]
    }

    getActiveView() {
        return this.registry.services.layout.getHoveredView();
    }
}