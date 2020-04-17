import { EditorCamera } from './EditorCamera';
import { CameraTool } from '../canvas/tools/camera/CameraTool';
import { Editor } from '../../Editor';
import { Point } from '../../../misc/geometry/shapes/Point';
import { AbstractTool } from '../canvas/tools/AbstractTool';
import { ToolType } from '../canvas/tools/Tool';
import { RendererView } from './RendererView';
import { ServiceLocator } from '../../services/ServiceLocator';
import { Stores } from '../../stores/Stores';


export class RendererCameraTool extends AbstractTool {

    static readonly ZOOM_MIN = 0.1;
    static readonly ZOOM_MAX = 5;

    readonly LOG_ZOOM_MIN = Math.log(CameraTool.ZOOM_MIN);
    readonly LOG_ZOOM_MAX = Math.log(CameraTool.ZOOM_MAX);
    readonly NUM_OF_STEPS: number;

    private controller: RendererView;

    constructor(controller: RendererView, getServices: () => ServiceLocator, getStores: () => Stores, numberOfSteps: number = 20) {
        super(ToolType.CAMERA, getServices, getStores)
        this.controller = controller;
        this.getServices = getServices;
        this.NUM_OF_STEPS = numberOfSteps;
    }

    zoomToNextStep(canvasPos?: Point) {
        const nextZoomLevel = this.getNextManualZoomStep();

        if (nextZoomLevel) {
            this.getServices().gameService().gameEngine.camera.zoom(nextZoomLevel);

            this.controller.renderWindow();
        }
    }

    zoomToPrevStep(canvasPos?: Point) {
        const prevZoomLevel = this.getPrevManualZoomLevel();
        
        if (prevZoomLevel) {
            this.getServices().gameService().gameEngine.camera.zoom(prevZoomLevel)

            this.controller.renderWindow();
        }
    }

    drag() {
        super.drag();

        const delta = this.getServices().pointerService().pointer.getScreenDiff().div(this.getCamera().getScale());
        
        this.getServices().gameService().gameEngine.camera.moveBy(delta.negate());
        return true;
    }

    moveBy(delta: Point) {
        this.getServices().gameService().gameEngine.camera.moveBy(delta);
    }

    getCamera() {
        return this.getServices().gameService().gameEngine.camera;
    }

    private getNextManualZoomStep(): number {
        let currentStep = this.calcLogarithmicStep(this.getServices().gameService().gameEngine.camera.getScale());
        currentStep = currentStep >= this.NUM_OF_STEPS - 1 ? this.NUM_OF_STEPS - 1 : currentStep

        return this.calcLogarithmicZoom(currentStep + 1);
    }

    private getPrevManualZoomLevel(): number {
        let currentStep = this.calcLogarithmicStep(this.getServices().gameService().gameEngine.camera.getScale());
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