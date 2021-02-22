import { Camera2D } from "../misc/camera/Camera2D";
import { AbstractShape } from "../../../modules/graph_editor/main/models/shapes/AbstractShape";
import { AbstractCanvasPanel } from "./AbstractCanvasPanel";

export abstract class Canvas2dPanel extends AbstractCanvasPanel<AbstractShape> {
    setCamera(camera: Camera2D) {
        super.setCamera(camera);
    }
}