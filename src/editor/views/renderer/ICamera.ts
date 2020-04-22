import { Point } from "../../../misc/geometry/shapes/Point";

export interface ICamera {
    zoom(scale: number);
    zoomToPosition(canvasPoint: Point, scale: number);
    zoomIn(zoomToPointer: boolean);
    zoomOut(zoomToPointer: boolean);
    screenToCanvasPoint(screenPoint: Point): Point;
    moveBy(amount: Point);
    moveTo(point: Point);
    getCenterPoint(): Point;
    getScale(): number;
    getTranslate(): Point;
}