import { Point } from "../../../misc/geometry/shapes/Point";

export interface ICamera {
    screenToCanvasPoint(screenPoint: Point): Point;
    zoom(scale: number);
    zoomToPosition(canvasPoint: Point, scale: number);
    moveBy(amount: Point);
    moveTo(point: Point);
    getCenterPoint(): Point;
    getScale(): number;
    getTranslate(): Point;
}