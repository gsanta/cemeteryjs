import { Point } from "../../../misc/geometry/shapes/Point";
import { MousePointer } from "../../services/input/MouseService";

export interface ICamera {
    zoom(scale: number);
    zoomIn(zoomToPointer: boolean);
    zoomOut(zoomToPointer: boolean);
    screenToCanvasPoint(screenPoint: Point): Point;
    moveBy(amount: Point);
    moveTo(point: Point);
    getCenterPoint(): Point;
    getScale(): number;
    getTranslate(): Point;
    pan(pointer: MousePointer): void;
}