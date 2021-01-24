import { Point } from "./Point";
import { Rectangle } from "./Rectangle";

export enum ShapeOrigin {
    CENTER
}

export interface BoundingInfo {
    min: [number, number];
    max: [number, number];
    extent: [number, number];
}

export interface GeometryPrimitive {
    scale(point: Point): GeometryPrimitive;
    translate(point: Point): GeometryPrimitive;

    getBoundingCenter(): Point;
    getBoundingRectangle(): Rectangle;

    clone(): GeometryPrimitive;
    toString(): string;
}