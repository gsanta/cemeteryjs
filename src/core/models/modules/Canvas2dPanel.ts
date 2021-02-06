import { Camera2D } from "../misc/camera/Camera2D";
import { ShapeObservable } from "../ShapeObservable";
import { AbstractShape } from "../shapes/AbstractShape";
import { AbstractCanvasPanel } from "./AbstractCanvasPanel";

export abstract class Canvas2dPanel extends AbstractCanvasPanel<AbstractShape> {
    abstract observable: ShapeObservable;

    setCamera(camera: Camera2D) {
        super.setCamera(camera);
    }
}