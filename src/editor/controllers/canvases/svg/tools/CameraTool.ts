import { Camera, nullCamera } from "../models/Camera";
import { AbstractTool } from './AbstractTool';
import { Point } from "../../../../../model/geometry/shapes/Point";
import { EditorFacade } from '../../../EditorFacade';
import { ToolType } from "./Tool";
import { Rectangle } from "../../../../../model/geometry/shapes/Rectangle";

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

    private origDimension: Rectangle;

    static readonly ZOOM_MIN = 0.1;
    static readonly ZOOM_MAX = 5;

    readonly LOG_ZOOM_MIN = Math.log(CameraTool.ZOOM_MIN);
    readonly LOG_ZOOM_MAX = Math.log(CameraTool.ZOOM_MAX);
    readonly NUM_OF_STEPS: number;

    private editorFacade: EditorFacade;

    constructor(editorFacade: EditorFacade, cameraInitializerFunc = cameraInitializer, numberOfSteps: number = 20) {
        super(ToolType.CAMERA);
        this.NUM_OF_STEPS = numberOfSteps;
        this.editorFacade = editorFacade;
        this.cameraInitializerFunc = cameraInitializerFunc;
    }

    onResize() {
        const prevScale = this.camera.getScale(); 
        const prevTranslate = this.camera.getViewBox().topLeft; 
    
        this.camera = this.cameraInitializerFunc(this.editorFacade.svgCanvasId);
        this.camera.moveTo(prevTranslate);
        this.camera.zoom(prevScale);

        this.editorFacade.svgCanvasController.renderCanvas();
    }

    zoomToNextStep(canvasPos?: Point) {
        canvasPos = canvasPos ? canvasPos : this.camera.screenToCanvasPoint(this.camera.screenSize.getVectorCenter());
        
        const screenPoint = this.camera.canvasToScreenPoint(canvasPos);
        const pointerRatio = new Point(screenPoint.x / this.camera.screenSize.x, screenPoint.y / this.camera.screenSize.y);
        const nextZoomLevel = this.getNextManualZoomStep();

        if (nextZoomLevel) {
            this.camera.setTopLeftCorner(canvasPos, nextZoomLevel);
            this.camera.moveBy(ratioOfViewBox(this.camera, pointerRatio).negate());

            this.editorFacade.svgCanvasController.renderCanvas();
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

            this.editorFacade.svgCanvasController.renderCanvas();
        }
    }

    down() {
        super.down();

        this.origDimension = this.editorFacade.svgCanvasController.cameraTool.getCamera().getViewBox();
    }

    drag() {
        super.drag();

        const canvasController = this.editorFacade.svgCanvasController;
        
        const mouseController = canvasController.mouseController;
    
        const deltaInScreenSize = mouseController.movePoint.subtract(mouseController.downPoint);
        const deltaInCanvasSize = canvasController.cameraTool.getCamera().screenToCanvasPoint(deltaInScreenSize); 
        
        canvasController.cameraTool.getCamera().setViewBox(this.origDimension);
        canvasController.cameraTool.getCamera().moveBy(deltaInCanvasSize.negate());

        canvasController.renderCanvas();
    }

    up() {
        super.up();

        this.origDimension = null;
    }

    getCamera() {
        if (this.camera === nullCamera) {
            this.camera = this.cameraInitializerFunc(this.editorFacade.svgCanvasId);
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