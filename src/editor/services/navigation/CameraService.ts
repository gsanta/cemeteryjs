import { Point } from "../../../misc/geometry/shapes/Point";
import { Stores } from "../../stores/Stores";
import { ServiceLocator } from "../ServiceLocator";
import { UpdateTask } from "../UpdateServices";

export class CameraService {
    serviceName = 'camera-service';
    static readonly ZOOM_MIN = 0.1;
    static readonly ZOOM_MAX = 5;

    readonly LOG_ZOOM_MIN = Math.log(CameraService.ZOOM_MIN);
    readonly LOG_ZOOM_MAX = Math.log(CameraService.ZOOM_MAX);
    readonly NUM_OF_STEPS: number;
    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(getServices: () => ServiceLocator, getStores: () => Stores, numberOfSteps: number = 20) {
        this.NUM_OF_STEPS = numberOfSteps;
        this.getServices = getServices;
        this.getStores = getStores;
    }

    zoomToNextStep(canvasPos?: Point) {
        const camera = this.getStores().viewStore.getActiveView().getCamera();
        canvasPos = canvasPos ? canvasPos : camera.screenToCanvasPoint(camera.getCenterPoint());
        
        const nextZoomLevel = this.getNextManualZoomStep();

        if (nextZoomLevel) {
            camera.zoomToPosition(canvasPos, nextZoomLevel);

            this.getServices().update.runImmediately(UpdateTask.RepaintCanvas);
        }
    }

    zoomToPrevStep(canvasPos?: Point) {
        const camera = this.getStores().viewStore.getActiveView().getCamera();
        canvasPos = canvasPos ? canvasPos : camera.screenToCanvasPoint(camera.getCenterPoint());

        const prevZoomLevel = this.getPrevManualZoomLevel();
        
        if (prevZoomLevel) {
            camera.zoomToPosition(canvasPos, prevZoomLevel);

            this.getServices().update.runImmediately(UpdateTask.RepaintCanvas);
        }
    }

    private getNextManualZoomStep(): number {
        const camera = this.getStores().viewStore.getActiveView().getCamera();

        let currentStep = this.calcLogarithmicStep(camera.getScale());
        currentStep = currentStep >= this.NUM_OF_STEPS - 1 ? this.NUM_OF_STEPS - 1 : currentStep

        return this.calcLogarithmicZoom(currentStep + 1);
    }

    private getPrevManualZoomLevel(): number {
        const camera = this.getStores().viewStore.getActiveView().getCamera();

        let currentStep = this.calcLogarithmicStep(camera.getScale());
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