import { Point } from "../../utils/geometry/shapes/Point";
import { Camera2D } from "../models/misc/camera/Camera2D";
import { Registry } from "../Registry";
import { AbstractCanvasPlugin, calcOffsetFromDom } from "./AbstractCanvasPlugin";
import { UI_Region } from "./UI_Plugin";
import { CanvasControllerId, CanvasController } from './controller/CanvasController';

function getScreenSize(canvasId: string): Point {
    if (typeof document !== 'undefined') {
        const svg: HTMLElement = document.getElementById(canvasId);

        if (svg) {
            const rect: ClientRect = svg.getBoundingClientRect();
            return new Point(rect.width, rect.height);
        }
    }
    return undefined;
}

export const DUMMY_CAMERA_SIZE = new Point(100, 100);

function cameraInitializer(canvasId: string, registry: Registry) {
    const screenSize = getScreenSize(canvasId);
    if (screenSize) {
        return new Camera2D(registry, new Point(screenSize.x, screenSize.y));
    } else {
        return new Camera2D(registry, DUMMY_CAMERA_SIZE);
    }
}

export class Canvas_2d_Plugin extends AbstractCanvasPlugin {
    region = UI_Region.Canvas1;
    private camera: Camera2D;

    constructor(id: string, registry: Registry) {
        super(registry);

        this.id = id;

        this.controllers.set(CanvasControllerId, new CanvasController(this, this.registry));
        this.camera = cameraInitializer(this.id, registry);
    }

    getStore() {
        return this.registry.stores.canvasStore;
    }

    resize(): void {
        const screenSize = getScreenSize(this.id);
        screenSize && this.camera.resize(screenSize);
        this.renderFunc && this.renderFunc();
    }

    getOffset() {
        return calcOffsetFromDom(this.htmlElement);
    }

    getCamera() {
        return this.camera;
    }
}