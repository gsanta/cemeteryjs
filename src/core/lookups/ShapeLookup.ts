import { NodeEditorPanelId } from "../../modules/graph_editor/registerNodeEditor";
import { SketchEditorPanelId } from "../../modules/sketch_editor/main/registerSketchEditor";
import { Registry } from "../Registry";
import { ShapeStore } from "../stores/ShapeStore";


export class ShapeLookup {
    scene: ShapeStore;
    node: ShapeStore;

    constructor(registry: Registry) {
        this.scene = new ShapeStore(SketchEditorPanelId, registry);
        this.node = new ShapeStore(NodeEditorPanelId, registry);
    }
}