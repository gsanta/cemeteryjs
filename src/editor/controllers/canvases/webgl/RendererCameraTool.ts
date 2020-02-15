import { EditorCamera } from './EditorCamera';
import { CameraTool } from '../svg/tools/CameraTool';
import { EditorFacade } from '../../EditorFacade';
import { Point } from '../../../../misc/geometry/shapes/Point';
import { AbstractTool } from '../svg/tools/AbstractTool';
import { ToolType } from '../svg/tools/Tool';
import { WebglCanvasController } from './WebglCanvasController';


export class RendererCameraTool extends AbstractTool {
    private camera: EditorCamera;

    static readonly ZOOM_MIN = 0.1;
    static readonly ZOOM_MAX = 5;

    readonly LOG_ZOOM_MIN = Math.log(CameraTool.ZOOM_MIN);
    readonly LOG_ZOOM_MAX = Math.log(CameraTool.ZOOM_MAX);
    readonly NUM_OF_STEPS: number;

    private editorFacade: EditorFacade;
    private controller: WebglCanvasController;

    constructor(controller: WebglCanvasController, editorCamera: EditorCamera, numberOfSteps: number = 20) {
        super(ToolType.CAMERA)
        this.controller = controller;
        this.camera = editorCamera;
        this.NUM_OF_STEPS = numberOfSteps;
    }

    zoomToNextStep(canvasPos?: Point) {
        const nextZoomLevel = this.getNextManualZoomStep();

        if (nextZoomLevel) {
            this.camera.zoom(nextZoomLevel);

            this.editorFacade.svgCanvasController.renderWindow();
        }
    }

    zoomToPrevStep(canvasPos?: Point) {
        const prevZoomLevel = this.getPrevManualZoomLevel();
        
        if (prevZoomLevel) {
            this.camera.zoom(prevZoomLevel)

            this.editorFacade.svgCanvasController.renderWindow();
        }
    }

    drag() {
        super.drag();

        const mouseController = this.controller.mouseHander;
    
        const delta = mouseController.pointer.getScreenDiff().div(this.getCamera().getScale());
        
        this.camera.moveBy(delta.negate());

        this.controller.renderWindow();
    }

    moveBy(delta: Point) {
        this.camera.moveBy(delta);
    }

    getCamera() {
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