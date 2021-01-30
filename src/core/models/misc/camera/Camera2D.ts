import { Point } from "../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { PointerTracker } from "../../../controller/ToolHandler";
import { ICamera } from './ICamera';
import { Registry } from "../../../Registry";

export class Camera2D implements ICamera {
    private screenSize: Point;
    private viewBox: Rectangle;
    static readonly ZOOM_MIN = 0.1;
    static readonly ZOOM_MAX = 5;

    readonly LOG_ZOOM_MIN = Math.log(Camera2D.ZOOM_MIN);
    readonly LOG_ZOOM_MAX = Math.log(Camera2D.ZOOM_MAX);
    readonly NUM_OF_STEPS: number = 100;
    private registry: Registry;

    constructor(registry: Registry, screenSize: Point) {
        this.registry = registry;
        this.screenSize = screenSize;
        this.viewBox = new Rectangle(new Point(0, 0), new Point(screenSize.x, screenSize.y));
    }

    resize(screenSize: Point) {
        const scale = this.getScale();
        this.screenSize = screenSize;
        const centerPoint = this.viewBox.topLeft.add(new Point(this.viewBox.getWidth() / 2, this.viewBox.getHeight() / 2));
        this.setCenter(centerPoint, scale);
    }

    pan(pointer: PointerTracker) {
        const delta = pointer.getScreenDiff().div(this.getScale());
        this.setViewBox(this.viewBox.clone().translate(new Point(-delta.x, -delta.y)));
    }

    private zoomToPosition(canvasPoint: Point, scale: number) {
        const screenPoint = this.canvasToScreenPoint(canvasPoint);
        const pointerRatio = new Point(screenPoint.x / this.screenSize.x, screenPoint.y / this.screenSize.y);


        this.setTopLeftCorner(canvasPoint, scale);
        const moveAmount = this.getRatioOfViewBox(this, pointerRatio).negate();
        this.setViewBox(this.viewBox.clone().translate(new Point(moveAmount.x, moveAmount.y)));

    }

    private setTopLeftCorner(canvasPoint: Point, scale: number) {
        let width = this.screenSize.x / scale;
        let height = this.screenSize.y / scale;

        const topLeft = new Point(canvasPoint.x, canvasPoint.y);
        this.viewBox = new Rectangle(topLeft, new Point(topLeft.x + width, topLeft.y + height));
    }

    private setCenter(canvasPoint: Point, scale: number) {
        let width = this.screenSize.x / scale;
        let height = this.screenSize.y / scale;
        const halfSize = new Point(width / 2, height / 2);

        const centerPoint = new Point(canvasPoint.x, canvasPoint.y);

        this.viewBox = new Rectangle(centerPoint.subtract(halfSize), centerPoint.add(halfSize));

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

    getViewBox(): Rectangle {
        return this.viewBox;
    }

    setViewBox(newViewBox: Rectangle): void {
        this.viewBox = newViewBox;
    }

    getCenterPoint(): Point {
        return this.screenSize.getVectorCenter()
    }

    private getRatioOfViewBox(camera: Camera2D, ratio: Point): Point {
        return camera.viewBox.getSize().mul(ratio.x, ratio.y);
    }

    zoomWheel(pointerTracker: PointerTracker) {
        let nextZoomLevel: number

        if (pointerTracker.prevWheelState - pointerTracker.wheelState > 0) {
            nextZoomLevel = this.getNextManualZoomStep();
        } else {
            nextZoomLevel = this.getPrevManualZoomLevel();
        }

        if (nextZoomLevel) {
            this.zoomToPosition(pointerTracker.curr, nextZoomLevel);

            this.registry.services.render.reRender(this.registry.ui.helper.hoveredPanel.region);
        }
    }

    zoomIn(): boolean {
        const canvasPos = this.screenToCanvasPoint(this.getCenterPoint());

        const prevZoomLevel = this.getNextManualZoomStep();
        
        if (prevZoomLevel) {
            this.zoomToPosition(canvasPos, prevZoomLevel);
            return true;
        }

        return false;
    }

    zoomOut() {
        const canvasPos = this.screenToCanvasPoint(this.getCenterPoint());

        const prevZoomLevel = this.getPrevManualZoomLevel();
        
        if (prevZoomLevel) {
            this.zoomToPosition(canvasPos, prevZoomLevel);
            return true;
        }

        return false;
    }

    rotate(pointer: PointerTracker): void { throw new Error("Rotation is for 3d cameras, this camera does not support it."); }

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