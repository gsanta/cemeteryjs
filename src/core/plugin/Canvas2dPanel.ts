import { Camera2D } from "../models/misc/camera/Camera2D";
import { AbstractCanvasPanel } from "./AbstractCanvasPanel";

export abstract class Canvas2dPanel<D> extends AbstractCanvasPanel<D> {
    setCamera(camera: Camera2D) {
        super.setCamera(camera);
    }
}