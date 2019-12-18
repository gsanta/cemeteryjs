import { Polygon } from "./Polygon";
import { Segment } from "./Segment";
import { BoundingInfo, Shape, ShapeOrigin } from './Shape';
import { maxBy } from "../utils/Functions";
import { Point } from "./Point";

export class StripeView implements Shape {
    private polygon: Polygon;
    private angleToXAxis: number;

    // TODO: check if polygon is really a stripe.
    constructor(polygon: Polygon, angleToXAxis: number) {
        this.polygon = polygon;
        this.angleToXAxis = angleToXAxis;

        const edgeWithAxis = polygon.getEdges().find(edge => edge.getLine().getAngleToXAxis().getAngle() === this.angleToXAxis);

        if (!edgeWithAxis) {
            throw new Error('None of the edges has the desired angleToXAxis.');
        }
    }

    public getNormal(): number {
        return this.getCapEdges()[0].getSlope();
    }

    public setPosition(point: Point, origin?: ShapeOrigin): Shape { throw new Error ('Not implemented');}
    hasPoint(point: Point): boolean { throw new Error ('Not implemented');}
    scale(point: Point): Shape { throw new Error ('Not implemented');}
    translate(point: Point): Shape { throw new Error ('Not implemented');}
    negate(axis: 'x' | 'y'): Shape { throw new Error ('Not implemented');}
    getBoundingInfo(): BoundingInfo { throw new Error ('Not implemented');}
    getBoundingCenter(): Point { throw new Error ('Not implemented');}
    getBoundingRectangle(): Shape { throw new Error ('Not implemented');}

    clone(): Shape { throw new Error ('Not implemented');}
    /**
     * Determines whether the two `Shape`s have coincident edges, if they have returns the following array structure
     * [the common `Segment` segment, the index of the edge in this `Shape`, the index of the edge in the other `Shape`],
     * otherwise returns undefined
     */

    getCoincidentLineSegment(other: Shape): [Segment, number, number] { throw new Error ('Not implemented');}
    /**
     * Sets the `Point` at the given `index` based on the initial `Point` ordering, and returns with the new `Shape`.
     */
    setPoint(index: number, newPoint: Point): Shape { throw new Error ('Not implemented');}
    getPoints(): Point[] { throw new Error ('Not implemented');}
    equalTo(otherShape: Shape): boolean { throw new Error ('Not implemented');}
    toString(): string { throw new Error ('Not implemented');}

    public getSlope() {
        return this.getEdges()[0].getSlope();
    }

    public merge(otherStripe: StripeView): Polygon {
        const [edge1, edge2] = this.getCapEdges();
        const [edge3, edge4] = otherStripe.getCapEdges();

        const distances: [number, [Segment, Segment]][] = [
            [edge1.getBoundingCenter().distanceTo(edge3.getBoundingCenter()), [edge1, edge3]],
            [edge1.getBoundingCenter().distanceTo(edge4.getBoundingCenter()), [edge1, edge4]],
            [edge2.getBoundingCenter().distanceTo(edge3.getBoundingCenter()), [edge2, edge3]],
            [edge2.getBoundingCenter().distanceTo(edge4.getBoundingCenter()), [edge2, edge4]]
        ];

        const maxDistance = maxBy<[number, [Segment, Segment]]>(distances, (a, b) => a[0] - b[0]);

        const [segment1, segment2] = maxDistance[1];

        return StripeView.createRectangleFromTwoOppositeSides(segment1, segment2);
    }

    public static createRectangleFromTwoOppositeSides(side1: Segment, side2: Segment): Polygon {

        if (side1.getPoints()[0].distanceTo(side2.getPoints()[0]) < side1.getPoints()[0].distanceTo(side2.getPoints()[1])) {
            side2 = new Segment(side2.getPoints()[1], side2.getPoints()[0]);
        }

        return new Polygon([
            side1.getPoints()[0],
            side1.getPoints()[1],
            side2.getPoints()[0],
            side2.getPoints()[1],
        ]);
    }

    /**
     * Returns with the overlapping `Segment` and the index of the ovelapping edge of the `StripeView` if there is an ovelap,
     * undefined otherwise
     * TODO: better naming of the function
     */
    public overlaps(segment: Segment): [Segment, number] {
        const longEdges = this.getEdges();
        const allEdges = this.polygon.getEdges();

        for (let i = 0; i < longEdges.length; i++) {
            const coincidentInfo = segment.getCoincidentLineSegment(longEdges[i]);
            if (coincidentInfo) {
                const edge = allEdges.find(e => e.equalTo(longEdges[i]));
                return [coincidentInfo[0], allEdges.indexOf(edge)];
            }
        }
    }

    public getEdges(): [Segment, Segment] {
        const edges = this.polygon.getEdges();

        if (edges[0].getLine().getAngleToXAxis().getAngle() === this.angleToXAxis) {
            return [edges[0], edges[2]]
        } else {
            return [edges[1], edges[3]]
        }
    }

    public getCapEdges(): [Segment, Segment] {
        const edges = this.polygon.getEdges();

        if (edges[0].getLine().getAngleToXAxis().getAngle() !== this.angleToXAxis) {
            return [edges[0], edges[2]]
        } else {
            return [edges[1], edges[3]]
        }
    }
}