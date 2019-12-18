import { Point } from "./Point";
import { Segment } from "./Segment";

export enum ShapeOrigin {
    CENTER
}

export interface BoundingInfo {
    min: [number, number];
    max: [number, number];
    extent: [number, number];
}

export interface Shape {
    setPosition(point: Point, origin?: ShapeOrigin): Shape;
    hasPoint(point: Point): boolean;
    scale(point: Point): Shape;
    translate(point: Point): Shape;
    negate(axis: 'x' | 'y'): Shape;

    getBoundingInfo(): BoundingInfo;
    getBoundingCenter(): Point;
    getBoundingRectangle(): Shape;

    clone(): Shape;
    /**
     * Determines whether the two `Shape`s have coincident edges, if they have returns the following array structure
     * [the common `Segment` segment, the index of the edge in this `Shape`, the index of the edge in the other `Shape`],
     * otherwise returns undefined
     */

    getCoincidentLineSegment(other: Shape): [Segment, number, number];
    /**
     * Sets the `Point` at the given `index` based on the initial `Point` ordering, and returns with the new `Shape`.
     */
    setPoint(index: number, newPoint: Point): Shape;
    getPoints(): Point[];
    getEdges(): Segment[];
    equalTo(otherShape: Shape): boolean;
    toString(): string;
}