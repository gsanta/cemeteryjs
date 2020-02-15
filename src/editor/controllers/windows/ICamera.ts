import { Point } from "../../../misc/geometry/shapes/Point";

export interface ICamera {
    screenToCanvasPoint(screenPoint: Point): Point;
}