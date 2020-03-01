import { Camera, nullCamera } from '../models/Camera';
import { AbstractTool } from './AbstractTool';
import { Point } from "../../../misc/geometry/shapes/Point";
import { ToolType } from "./Tool";
import { CanvasController } from '../CanvasController';
import { UpdateTask } from '../services/CanvasUpdateServices';

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

function ratioOfViewBox(camera: Camera, ratio: Point): Point {
    return camera.getViewBox().getSize().mul(ratio.x, ratio.y);
}

export class CameraTool extends AbstractTool {
    private cameraInitializerFunc: (canvasId: string) => Camera;
    private camera: Camera = nullCamera;

    static readonly ZOOM_MIN = 0.1;
    static readonly ZOOM_MAX = 5;

    readonly LOG_ZOOM_MIN = Math.log(CameraTool.ZOOM_MIN);
    readonly LOG_ZOOM_MAX = Math.log(CameraTool.ZOOM_MAX);
    readonly NUM_OF_STEPS: number;

    private controller: CanvasController;

    constructor(controller: CanvasController, cameraInitializerFunc = cameraInitializer, numberOfSteps: number = 20) {
        super(ToolType.CAMERA);
        this.NUM_OF_STEPS = numberOfSteps;
        this.controller = controller;
        this.cameraInitializerFunc = cameraInitializerFunc;
    }

    resize() {
        const prevScale = this.camera.getScale(); 
        const prevTranslate = this.camera.getViewBox().topLeft; 
    
        this.camera = this.cameraInitializerFunc(this.controller.getId());
        this.camera.moveTo(prevTranslate);
        this.camera.zoom(prevScale);

        this.controller.updateService.addUpdateTasks(UpdateTask.RepaintCanvas);
    }

    zoomToNextStep(canvasPos?: Point) {
        canvasPos = canvasPos ? canvasPos : this.camera.screenToCanvasPoint(this.camera.screenSize.getVectorCenter());
        
        const screenPoint = this.camera.canvasToScreenPoint(canvasPos);
        const pointerRatio = new Point(screenPoint.x / this.camera.screenSize.x, screenPoint.y / this.camera.screenSize.y);
        const nextZoomLevel = this.getNextManualZoomStep();

        if (nextZoomLevel) {
            this.camera.setTopLeftCorner(canvasPos, nextZoomLevel);
            this.camera.moveBy(ratioOfViewBox(this.camera, pointerRatio).negate());

            this.controller.updateService.addUpdateTasks(UpdateTask.RepaintCanvas);
        }
    }

    zoomToPrevStep(canvasPos?: Point) {
        canvasPos = canvasPos ? canvasPos : this.camera.screenToCanvasPoint(this.camera.screenSize.getVectorCenter());

        const screenPoint = this.camera.canvasToScreenPoint(canvasPos);
        const pointerRatio = new Point(screenPoint.x / this.camera.screenSize.x, screenPoint.y / this.camera.screenSize.y);
        const prevZoomLevel = this.getPrevManualZoomLevel();
        
        if (prevZoomLevel) {
            this.camera.setTopLeftCorner(canvasPos, prevZoomLevel);
            this.camera.moveBy(ratioOfViewBox(this.camera, pointerRatio).negate());

            this.controller.updateService.addUpdateTasks(UpdateTask.RepaintCanvas);
        }
    }

    down() {
        const update = super.down();

        return update;
    }

    drag() {
        super.drag();
        const delta = this.controller.pointer.pointer.getScreenDiff().div(this.getCamera().getScale());
        
        this.controller.cameraTool.getCamera().moveBy(delta.negate());

        this.controller.updateService.addUpdateTasks(UpdateTask.RepaintCanvas);
    }

    getCamera() {
        if (this.camera === nullCamera) {
            this.camera = this.cameraInitializerFunc(this.controller.getId());
        }

        return this.camera;
    }

    private getNextManualZoomStep(): number {
        let currentStep = this.calcLogarithmicStep(this.camera.getScale());
        currentStep = currentStep >= this.NUM_OF_STEPS - 1 ? this.NUM_OF_STEPS - 1 : currentStep

        return this.calcLogarithmicZoom(currentStep + 1);
    }

    private getPrevManualZoomLevel(): number {
        let currentStep = this.calcLogarithmicStep(this.camera.getScale());
        currentStep = currentStep <= 1 ? 1 : currentStep

        return this.calcLogarithmicZoom(currentStep - 1);
    }

    private calcLogarithmicStep(currentZoom: number) {
        const logCurrZoom = Math.log(currentZoom);
        const logCurrSize = logCurrZoom - this.LOG_ZOOM_MIN;
        const logRange = this.LOG_ZOOM_MAX - this.LOG_ZOOM_MIN;

        const currentStep = logCurrSize * (this.NUM_OF_STEPS) / logRange;

        return currentStep;
    }

    private calcLogarithmicZoom(currentStep: number) {
        const logZoom = this.LOG_ZOOM_MIN + (this.LOG_ZOOM_MAX - this.LOG_ZOOM_MIN) * currentStep / (this.NUM_OF_STEPS);
        const zoom = Math.exp(logZoom);
        return zoom;
    }
}