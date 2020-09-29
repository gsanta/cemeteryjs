import { Point } from "../../utils/geometry/shapes/Point";
import { Camera2D } from "../models/misc/camera/Camera2D";
import { Registry } from "../Registry";
import { AbstractCanvasPlugin, calcOffsetFromDom } from "./AbstractCanvasPlugin";
import { UI_Region } from "./UI_Plugin";
import { FormController, PropController } from "./controller/FormController";
import { ToolType } from "./tools/Tool";
import { CameraTool } from "./tools/CameraTool";

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

export enum CanvasControllerProps {
    ZoomIn = 'zoomIn',
    ZoomOut = 'ZoomOut',
    Undo = 'undo',
    Redo = 'redo'
}

export const CanvasControllerId = 'canvas_controller_id';

export class Canvas_2d_Plugin extends AbstractCanvasPlugin {
    region = UI_Region.Canvas1;
    private camera: Camera2D;

    constructor(id: string, registry: Registry) {
        super(registry);

        this.id = id;

        const controller = new FormController(this, this.registry);
        controller.registerPropControl(CanvasControllerProps.ZoomIn, ZoomInControl);
        controller.registerPropControl(CanvasControllerProps.ZoomOut, ZoomOutControl);
        controller.registerPropControl(CanvasControllerProps.Undo, UndoControl);
        controller.registerPropControl(CanvasControllerProps.Redo, RedoControl);

        this.controllers.set(CanvasControllerId, controller);
        this.camera = cameraInitializer(this.id, registry);
    }

    getStore() {
        return this.registry.stores.viewStore;
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

const ZoomInControl: PropController<any> = {
    click(context) {
        ((<AbstractCanvasPlugin> context.plugin).toolController.getById(ToolType.Camera) as CameraTool).zoomIn();
    }
}

const ZoomOutControl: PropController<any> = {
    click(context) {
        ((<AbstractCanvasPlugin> context.plugin).toolController.getById(ToolType.Camera) as CameraTool).zoomOut();
    }
}

const UndoControl: PropController<any> = {
    click(context) {
        context.registry.services.history.undo()
    }
}

const RedoControl: PropController<any> = {
    click(context) {
        context.registry.services.history.redo()
    }
}
