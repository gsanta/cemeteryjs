import { Point } from "../../../../utils/geometry/shapes/Point";
import { PointerTracker } from "../../../controller/PointerHandler";

export interface ICamera {
    zoomIn(pointer: PointerTracker<any>): boolean;
    zoomOut(pointer: PointerTracker<any>): boolean;
    zoomWheel(pointer: PointerTracker<any>): void;
    screenToCanvasPoint(screenPoint: Point): Point;
    getCenterPoint(): Point;
    getScale(): number;
    getTranslate(): Point;
    pan(pointer: PointerTracker<any>): void;
    rotate(pointer: PointerTracker<any>): void;
    resize(screenSize: Point): void;
}