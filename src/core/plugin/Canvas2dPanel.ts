import { Camera2D } from "../models/misc/camera/Camera2D";
import { ShapeObservable } from "../models/ShapeObservable";
import { AbstractShape } from "../models/shapes/AbstractShape";
import { AbstractCanvasPanel } from "./AbstractCanvasPanel";

export abstract class Canvas2dPanel extends AbstractCanvasPanel<AbstractShape> {
    abstract observable: ShapeObservable;

    setCamera(camera: Camera2D) {
        super.setCamera(camera);
    }
}