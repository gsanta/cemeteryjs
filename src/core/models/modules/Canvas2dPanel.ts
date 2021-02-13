import { Camera2D } from "../misc/camera/Camera2D";
import { AbstractShape } from "../shapes/AbstractShape";
import { AbstractCanvasPanel } from "./AbstractCanvasPanel";

export abstract class Canvas2dPanel extends AbstractCanvasPanel<AbstractShape> {
    setCamera(camera: Camera2D) {
        super.setCamera(camera);
    }
}