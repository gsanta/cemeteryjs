import { NodeEditorPanelId } from "../../plugins/canvas_plugins/node_editor/registerNodeEditor";
import { SceneEditorPanelId } from "../../plugins/canvas_plugins/scene_editor/registerSceneEditor";
import { Registry } from "../Registry";
import { ShapeStore } from "../stores/ShapeStore";


export class ShapeLookup {
    scene: ShapeStore;
    node: ShapeStore;

    constructor(registry: Registry) {
        this.scene = new ShapeStore(SceneEditorPanelId, registry);
        this.node = new ShapeStore(NodeEditorPanelId, registry);
    }
}