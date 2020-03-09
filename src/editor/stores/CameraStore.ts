import { nullCamera, Camera } from "../views/canvas/models/Camera";
import { Point } from "../../misc/geometry/shapes/Point";

export function cameraInitializer(canvasId: string) {
    if (typeof document !== 'undefined') {
        const svg: HTMLElement = document.getElementById(canvasId);

        if (svg) {
            const rect: ClientRect = svg.getBoundingClientRect();
            return new Camera(new Point(rect.width, rect.height));
        } else {
            return nullCamera;
        }
    } else {
        return nullCamera;
    }
}

export class CameraStore {
    private camera: Camera = nullCamera;
    private canvasId: string;

    constructor(canvasId: string) {
        this.canvasId = canvasId;
    }

    getCamera() {
        if (this.camera === nullCamera) {
            this.camera = cameraInitializer(this.canvasId);
        }

        return this.camera;
    }

    setCamera(camera: Camera) {
        this.camera = camera;
    }
}