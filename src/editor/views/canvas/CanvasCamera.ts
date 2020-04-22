import { Point } from "../../../misc/geometry/shapes/Point";
import { Rectangle } from "../../../misc/geometry/shapes/Rectangle";
import { ICamera } from '../renderer/ICamera';
import { Stores } from "../../stores/Stores";
import { ServiceLocator } from "../../services/ServiceLocator";
import { UpdateTask } from "../../services/UpdateServices";

export class CanvasCamera implements ICamera {
    readonly screenSize: Point;
    private viewBox: Rectangle;
    serviceName = 'camera-service';
    static readonly ZOOM_MIN = 0.1;
    static readonly ZOOM_MAX = 5;

    readonly LOG_ZOOM_MIN = Math.log(CanvasCamera.ZOOM_MIN);
    readonly LOG_ZOOM_MAX = Math.log(CanvasCamera.ZOOM_MAX);
    readonly NUM_OF_STEPS: number;
    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(getServices: () => ServiceLocator, getStores: () => Stores, canvasSize: Point) {
        this.getServices = getServices;
        this.getStores = getStores;
        this.screenSize = canvasSize;
        this.viewBox = new Rectangle(new Point(0, 0), new Point(canvasSize.x, canvasSize.y));
    }

    zoom(scale: number) {
        let width = this.screenSize.x / scale;
        let height = this.screenSize.y / scale;

        const topLeft = this.viewBox.topLeft;
        this.viewBox = new Rectangle(topLeft, new Point(topLeft.x + width, topLeft.y + height));
    }

    zoomToPosition(canvasPoint: Point, scale: number) {
        const screenPoint = this.canvasToScreenPoint(canvasPoint);
        const pointerRatio = new Point(screenPoint.x / this.screenSize.x, screenPoint.y / this.screenSize.y);


        this.setTopLeftCorner(canvasPoint, scale);
        this.moveBy(this.getRatioOfViewBox(this, pointerRatio).negate());
    }

    setTopLeftCorner(canvasPoint: Point, scale: number) {
        let width = this.screenSize.x / scale;
        let height = this.screenSize.y / scale;

        const topLeft = new Point(canvasPoint.x, canvasPoint.y);
        this.viewBox = new Rectangle(topLeft, new Point(topLeft.x + width, topLeft.y + height));
    }

    moveBy(amount: Point) {
        this.setViewBox(this.viewBox.clone().translate(new Point(amount.x, amount.y)));
    }

    moveTo(translate: Point): void {
        this.setViewBox(this.viewBox.clone().moveTo(new Point(translate.x, translate.y)));
    }

    screenToCanvasPoint(screenPoint: Point): Point {
        const scale = this.getScale();

        return screenPoint.clone().div(scale).add(this.viewBox.topLeft);
    }

    canvasToScreenPoint(canvasPoint: Point): Point {
        const scale = this.getScale();

        return canvasPoint.clone().subtract(this.viewBox.topLeft).mul(scale);
    }

    getScale(): number {
        return this.screenSize.x / this.viewBox.getWidth();
    }

    getTranslate(): Point {
        return this.viewBox.topLeft;
    }

    getViewBoxAsString(): string {
        return `${this.viewBox.topLeft.x} ${this.viewBox.topLeft.y} ${this.viewBox.getWidth()} ${this.viewBox.getHeight()}`;
    }

    setViewBox(newViewBox: Rectangle): void {
        this.viewBox = newViewBox;
    }

    getCenterPoint(): Point {
        return this.screenSize.getVectorCenter()
    }

    private getRatioOfViewBox(camera: CanvasCamera, ratio: Point): Point {
        return camera.viewBox.getSize().mul(ratio.x, ratio.y);
    }

    zoomIn(zoomToPointer: boolean) {
        const camera = this.getStores().viewStore.getActiveView().getCamera();
        const canvasPos = zoomToPointer ? this.getServices().pointer.pointer.curr : camera.screenToCanvasPoint(camera.getCenterPoint());
        
        const nextZoomLevel = this.getNextManualZoomStep();

        if (nextZoomLevel) {
            camera.zoomToPosition(canvasPos, nextZoomLevel);

            this.getServices().update.runImmediately(UpdateTask.RepaintCanvas);
        }
    }

    zoomOut(zoomToPointer: boolean) {
        const camera = this.getStores().viewStore.getActiveView().getCamera();
        const canvasPos = zoomToPointer ? this.getServices().pointer.pointer.curr : camera.screenToCanvasPoint(camera.getCenterPoint());

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