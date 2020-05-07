import { Point } from "../../../misc/geometry/shapes/Point";
import { MousePointer } from "../../../core/services/input/MouseService";

export interface ICamera {
    zoomIn(): void;
    zoomOut(): void;
    zoomWheel(): void;
    screenToCanvasPoint(screenPoint: Point): Point;
    getCenterPoint(): Point;
    getScale(): number;
    getTranslate(): Point;
    pan(pointer: MousePointer): void;
    rotate(pointer: MousePointer): void;
    resize(screenSize: Point): void;
}