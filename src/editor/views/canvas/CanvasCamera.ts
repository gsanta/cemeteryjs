import { Point } from "../../../misc/geometry/shapes/Point";
import { Rectangle } from "../../../misc/geometry/shapes/Rectangle";
import { MousePointer } from "../../services/input/MouseService";
import { ServiceLocator } from "../../services/ServiceLocator";
import { UpdateTask } from "../../services/UpdateServices";
import { ICamera } from '../renderer/ICamera';

export class CanvasCamera implements ICamera {
    readonly screenSize: Point;
    private viewBox: Rectangle;
    serviceName = 'camera-service';
    static readonly ZOOM_MIN = 0.1;
    static readonly ZOOM_MAX = 5;

    readonly LOG_ZOOM_MIN = Math.log(CanvasCamera.ZOOM_MIN);
    readonly LOG_ZOOM_MAX = Math.log(CanvasCamera.ZOOM_MAX);
    readonly NUM_OF_STEPS: number = 100;
    private getServices: () => ServiceLocator;

    constructor(getServices: () => ServiceLocator, canvasSize: Point) {
        this.getServices = getServices;
        this.screenSize = canvasSize;
        this.viewBox = new Rectangle(new Point(0, 0), new Point(canvasSize.x, canvasSize.y));
    }

    pan(pointer: MousePointer) {
        const delta = pointer.getScreenDiff().div(this.getScale());
        this.setViewBox(this.viewBox.clone().translate(new Point(-delta.x, -delta.y)));
    }

    private zoomToPosition(canvasPoint: Point, scale: number) {
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

    zoomWheel() {
        const canvasPos = this.getServices().pointer.pointer.curr;        
        let nextZoomLevel: number

        if (this.getServices().pointer.prevWheelState - this.getServices().pointer.wheelState > 0) {
            nextZoomLevel = this.getNextManualZoomStep();
        } else {
            nextZoomLevel = this.getPrevManualZoomLevel();
        }

        if (nextZoomLevel) {
            this.zoomToPosition(canvasPos, nextZoomLevel);

            this.getServices().update.runImmediately(UpdateTask.RepaintCanvas);
        }
    }

    zoomIn() {
        const canvasPos = this.screenToCanvasPoint(this.getCenterPoint());

        const prevZoomLevel = this.getNextManualZoomStep();
        
        if (prevZoomLevel) {
            this.zoomToPosition(canvasPos, prevZoomLevel);

            this.getServices().update.runImmediately(UpdateTask.RepaintCanvas);
        }
    }

    zoomOut() {
        const canvasPos = this.screenToCanvasPoint(this.getCenterPoint());

        const prevZoomLevel = this.getPrevManualZoomLevel();
        
        if (prevZoomLevel) {
            this.zoomToPosition(canvasPos, prevZoomLevel);

            this.getServices().update.runImmediately(UpdateTask.RepaintCanvas);
        }
    }

    private getNextManualZoomStep(): number {
        let currentStep = this.calcLogarithmicStep(this.getScale());
        currentStep = currentStep >= this.NUM_OF_STEPS - 1 ? this.NUM_OF_STEPS - 1 : currentStep

        return this.calcLogarithmicZoom(currentStep + 1);
    }

    private getPrevManualZoomLevel(): number {
        let currentStep = this.calcLogarithmicStep(this.getScale());
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