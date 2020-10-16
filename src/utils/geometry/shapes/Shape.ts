import { Point } from "./Point";
import { Rectangle } from "./Rectangle";
import { FiniteLine } from "./FiniteLine";

export enum ShapeOrigin {
    CENTER
}

export interface BoundingInfo {
    min: [number, number];
    max: [number, number];
    extent: [number, number];
}

export interface Shape {
    scale(point: Point): Shape;
    translate(point: Point): Shape;

    getBoundingCenter(): Point;
    getBoundingRectangle(): Rectangle;

    clone(): Shape;
    toString(): string;
}