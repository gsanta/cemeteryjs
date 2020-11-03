import { Camera2D } from "../models/misc/camera/Camera2D";
import { Camera3D } from "../models/misc/camera/Camera3D";
import { AbstractCanvasPanel } from "./AbstractCanvasPanel";


export class Canvas3dPanel extends AbstractCanvasPanel {
    setCamera(camera: Camera3D) {
        super.setCamera(camera);
    }
}