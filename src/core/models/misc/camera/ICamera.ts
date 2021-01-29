import { Point } from "../../../../utils/geometry/shapes/Point";
import { PointerTracker } from "../../../controller/ToolController";

export interface ICamera {
    zoomIn(): boolean;
    zoomOut(): boolean;
    zoomWheel(): void;
    screenToCanvasPoint(screenPoint: Point): Point;
    getCenterPoint(): Point;
    getScale(): number;
    getTranslate(): Point;
    pan(pointer: PointerTracker): void;
    rotate(pointer: PointerTracker): void;
    resize(screenSize: Point): void;
}