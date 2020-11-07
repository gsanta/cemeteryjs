import { NodeEditorPanelId } from "../../plugins/canvas_plugins/node_editor/registerNodeEditor";
import { SceneEditorPanelId } from "../../plugins/canvas_plugins/scene_editor/registerSceneEditor";
import { Registry } from "../Registry";
import { ViewStore } from "../stores/ViewStore";


export class ViewLookup {
    scene: ViewStore;
    node: ViewStore;

    constructor(registry: Registry) {
        this.scene = new ViewStore(SceneEditorPanelId, registry);
        this.node = new ViewStore(NodeEditorPanelId, registry);
    }
}