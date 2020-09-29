import { Point } from "../../../../utils/geometry/shapes/Point";
import { MousePointer } from "../../../plugin/controller/ToolController";

export interface ICamera {
    zoomIn(): boolean;
    zoomOut(): boolean;
    zoomWheel(): void;
    screenToCanvasPoint(screenPoint: Point): Point;
    getCenterPoint(): Point;
    getScale(): number;
    getTranslate(): Point;
    pan(pointer: MousePointer): void;
    rotate(pointer: MousePointer): void;
    resize(screenSize: Point): void;
}