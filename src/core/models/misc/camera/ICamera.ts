import { Point } from "../../../../utils/geometry/shapes/Point";
import { PointerTracker } from "../../../controller/ToolHandler";

export interface ICamera {
    zoomIn(pointer: PointerTracker): boolean;
    zoomOut(pointer: PointerTracker): boolean;
    zoomWheel(pointer: PointerTracker): void;
    screenToCanvasPoint(screenPoint: Point): Point;
    getCenterPoint(): Point;
    getScale(): number;
    getTranslate(): Point;
    pan(pointer: PointerTracker): void;
    rotate(pointer: PointerTracker): void;
    resize(screenSize: Point): void;
}