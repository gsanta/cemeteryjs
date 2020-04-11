import { Point } from "../../../../../misc/geometry/shapes/Point";
import { Hotkey } from "../../../../services/HotkeyService";
import { ServiceLocator } from '../../../../services/ServiceLocator';
import { UpdateTask } from '../../../../services/UpdateServices';
import { Stores } from '../../../../stores/Stores';
import { cameraInitializer, CanvasView } from '../../CanvasView';
import { AbstractTool } from '../AbstractTool';
import { ToolType } from "../Tool";
import { WheelZoomHotkey } from "./WheelZoomHotkey";

export class CameraTool extends AbstractTool {
    static readonly ZOOM_MIN = 0.1;
    static readonly ZOOM_MAX = 5;

    readonly LOG_ZOOM_MIN = Math.log(CameraTool.ZOOM_MIN);
    readonly LOG_ZOOM_MAX = Math.log(CameraTool.ZOOM_MAX);
    readonly NUM_OF_STEPS: number;

    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    private hotkeys: Hotkey[] = [];

    constructor(getServices: () => ServiceLocator, getStores: () => Stores, numberOfSteps: number = 20) {
        super(ToolType.CAMERA);
        this.NUM_OF_STEPS = numberOfSteps;
        this.getServices = getServices;
        this.getStores = getStores;
        this.hotkeys = [new WheelZoomHotkey(getStores, getServices)];
        this.hotkeys.forEach(hk => this.getServices().hotkeyService().registerHotkey(hk));
    }

    resize() {
        const view = this.getStores().viewStore.getViewById<CanvasView>(CanvasView.id);

        const camera = view.getCamera();

        const prevScale = camera.getScale(); 
        const prevTranslate = camera.getTranslate(); 
    
        view.setCamera(cameraInitializer(view.getId()));
        view.getCamera().zoom(prevScale);
        view.getCamera().moveTo(prevTranslate.clone());

        this.getServices().updateService().runImmediately(UpdateTask.RepaintCanvas);
    }

    zoomToNextStep(canvasPos?: Point) {
        const camera = this.getStores().viewStore.getActiveView().getCamera();
        canvasPos = canvasPos ? canvasPos : camera.screenToCanvasPoint(camera.getCenterPoint());
        
        const nextZoomLevel = this.getNextManualZoomStep();

        if (nextZoomLevel) {
            camera.zoomToPosition(canvasPos, nextZoomLevel);

            this.getServices().updateService().runImmediately(UpdateTask.RepaintCanvas);
        }
    }

    zoomToPrevStep(canvasPos?: Point) {
        const camera = this.getStores().viewStore.getActiveView().getCamera();
        canvasPos = canvasPos ? canvasPos : camera.screenToCanvasPoint(camera.getCenterPoint());

        const prevZoomLevel = this.getPrevManualZoomLevel();
        
        if (prevZoomLevel) {
            camera.zoomToPosition(canvasPos, prevZoomLevel);

            this.getServices().updateService().runImmediately(UpdateTask.RepaintCanvas);
        }
    }

    drag() {
        super.drag();
        const camera = this.getStores().viewStore.getActiveView().getCamera();

        const delta = this.getServices().pointerService().pointer.getScreenDiff().div(camera.getScale());
        
        camera.moveBy(delta.negate());

        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
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