import { Point } from './Point';
import { Shape, ShapeOrigin, BoundingInfo } from './Shape';
import { Polygon } from './Polygon';
import { Line } from './Line';
import { GeometryService } from '../GeometryService';
import { StripeView } from './StripeView';

export class Segment implements Shape {
    private points: [Point, Point] = [null, null];
    private orderedPoints: [Point, Point] = [null, null];

    private geometryService: GeometryService;

    constructor(endPoint1: Point, endPoint2: Point, geometryService: GeometryService = new GeometryService()) {
        [this.points[0], this.points[1]] = [endPoint1, endPoint2];
        this.geometryService = geometryService;
        this.orderedPoints = this.points;
    }

    public getPoints(): Point[] {
        return this.orderedPoints;
    }

    public setPoint(index: number, newPoint: Point): Shape {
        const clonedPoints = [...this.points];
        clonedPoints.splice(index, 1, newPoint);

        return new Polygon(clonedPoints);
    }

    public hasPoint(point: Point): boolean {
        return this.points.find(p => p.equalTo(point)) !== undefined;
    }

    public getBoundingInfo(): BoundingInfo {
        const minX = this.points[0].x < this.points[1].x ? this.points[0].x : this.points[1].x;
        const maxX = this.points[0].x > this.points[1].x ? this.points[0].x : this.points[1].x;
        const minY = this.points[0].y < this.points[1].y ? this.points[0].y : this.points[1].y;
        const maxY = this.points[0].y > this.points[1].y ? this.points[0].y : this.points[1].y;

        return {
            min: [minX, minY],
            max: [maxX, maxY],
            extent: [maxX - minX, maxY - minY]
        };
    }

    public translate(point: Point): Shape {
        const point0 = this.points[0].addX(point.x).addY(point.y);
        const point1 = this.points[1].addX(point.x).addY(point.y);
        return this.geometryService.factory.edge(point0, point1);
    }

    public negate(axis: 'x' | 'y'): Segment {
        if (axis === 'x') {
            return this.geometryService.factory.edge(this.points[0].negateX(), this.points[1].negateX());
        } else {
            return this.geometryService.factory.edge(this.points[0].negateY(), this.points[1].negateY());
        }
    }

    public clone(): Shape {
        return this.geometryService.factory.edge(this.points[0], this.points[1]);
    }

    public setPosition(point: Point, origin: ShapeOrigin = ShapeOrigin.CENTER): Shape {
        const diff = this.getBoundingCenter().subtract(point);

        return this.geometryService.factory.edge(this.points[0].addX(diff.x).addY(diff.y), this.points[1].addX(diff.x).addY(diff.y));
    }

    public getBoundingRectangle(): Shape {
        let [x1, x2] = [this.points[0].x, this.points[1].x];
        let [y1, y2] = [this.points[0].y, this.points[1].y];

        [x1, x2] = x1 < x2 ? [x1, x2] : [x2, x1];
        [y1, y2] = y1 < y2 ? [y1, y2] : [y2, y1];

        return new Polygon([
            new Point(x1, y1),
            new Point(x1, y2),
            new Point(x2, y2),
            new Point(x2, y1)]);
    }

    public getBoundingCenter(): Point {
        return new Point((this.orderedPoints[0].x + this.orderedPoints[1].x) / 2, (this.orderedPoints[0].y + this.orderedPoints[1].y) / 2);
    }

    public getCoincidentLineSegment(other: Shape): [Segment, number, number] {
        const otherEdges = other.getEdges();

        for (let i = 0; i < otherEdges.length; i++) {
            const overlap = this.getCommonLineSegmentIfExists(otherEdges[i]);
            if (overlap) {
                return [overlap, 0, i];
            }
        }
    }

    public getEdges(): Segment[] {
        return [this];
    }

    intersection(otherSegment: Segment): Point {
        const line1 = this.getLine();
        const line2 = otherSegment.getLine();

        const point = line1.intersection(line2);

        if (point) {
            if (
                this.isXWithinSegment(point.x) &&
                otherSegment.isXWithinSegment(point.x) &&
                this.isYWithinSegment(point.y) &&
                otherSegment.isYWithinSegment(point.y)
            ) {
                return point;
            }
        }
    }

    /**
     * Creates a rectangular `Polygon` from a `Segment` via adding 'thickness' to it
     * on the `Segment`s normal direction
     */
    addThickness(thickness: number): Polygon {
        const bisectorLine = this.getPerpendicularBisector();

        const [point1, point2] = bisectorLine.getSegmentWithCenterPointAndDistance(this.getBoundingCenter(), thickness);

        const line1 = Line.fromPointSlopeForm(point1, this.getSlope());
        const [side1Point1, side1Point2] = line1.getSegmentWithCenterPointAndDistance(point1, this.getLength() / 2);

        const line2 = Line.fromPointSlopeForm(point2, this.getSlope());
        const [side2Point1, side2Point2] = line2.getSegmentWithCenterPointAndDistance(point2, this.getLength() / 2);

        return StripeView.createRectangleFromTwoOppositeSides(new Segment(side1Point1, side1Point2), new Segment(side2Point1, side2Point2));
    }

    toVector(): Point {
        return new Point(this.getPoints()[0].x - this.getPoints()[1].x, this.getPoints()[0].y - this.getPoints()[1].y);
    }

    private isXWithinSegment(x: number): boolean {
        let [minX, maxX] = [this.points[0].x, this.points[1].x];

        if (minX > maxX) {
            [minX, maxX] = [maxX, minX];
        }

        return x >= minX && x <= maxX;
    }

    private isYWithinSegment(y: number): boolean {
        let [minY, maxY] = [this.points[0].y, this.points[1].y];

        if (minY > maxY) {
            [minY, maxY] = [maxY, minY];
        }

        return y >= minY && y <= maxY;
    }

    /**
     * Returns true if the `Segment` segment in the parameter determines the same infinite line.
     */
    public isCoincidentToLine(otherLine: Segment) {
        return this.isPointOnTheLine(otherLine.points[0]) && this.isPointOnTheLine(otherLine.points[1]);
    }

    /**
     * Returns true if the `Point` in the parameter lies on the `Segment`.
     */
    public isPointOnTheLine(point: Point): boolean {
        const slope = this.getSlope();

        if (slope === undefined) {
            return point.x === this.points[0].x;
        } else {
            return point.y - this.points[0].y === this.getSlope() * (point.x - this.points[0].x)
        }
    }

    isPointOnSegment(point: Point): boolean {
        return this.isPointOnTheLine(point) && this.isXWithinSegment(point.x) && this.isYWithinSegment(point.y);
    }

    public getPerpendicularBisector(): Line {
        let slope = this.getSlope();
        if (slope === 0) {
            return Line.fromPointSlopeForm(this.getBoundingCenter(), undefined);
        } else if (slope === undefined) {
            return Line.fromPointSlopeForm(this.getBoundingCenter(), 0);
        } else {
            return Line.fromPointSlopeForm(this.getBoundingCenter(), -this.getSlope());
        }
    }

    /**
     * Determines if the segment in the parameter overlaps with this segment, if so returns the overlap as a new segment,
     * otherwise returns undefined.
     */
    private getCommonLineSegmentIfExists(otherLine: Segment): Segment {
        if (!this.isCoincidentToLine(otherLine)) {
            return undefined;
        }

        let [a, b] = [this.points[0].x, this.points[0].y];
        let [c, d] = [this.points[1].x, this.points[1].y];
        let [e, f] = [otherLine.points[0].x, otherLine.points[0].y];
        let [g, h] = [otherLine.points[1].x, otherLine.points[1].y];

        if (this.getLine().isVertical()) {
            [a, b, c, d] = b < d ? [a, b, c, d] : [c, d, a, b];
            [e, f, g, h] = f < h ? [e, f, g, h] : [g, h, e, f];

            if (b <= f && d >= h) {
                return this.geometryService.factory.edge(new Point(e, f), new Point(g, h));
            } else if (f <= b && h >= d) {
                return this.geometryService.factory.edge(new Point(a, b), new Point(c, d));
            } else if (b < f && d > f) {
                return this.geometryService.factory.edge(new Point(e, f), new Point(c, d));
            } else if (f < b && h > b) {
                return this.geometryService.factory.edge(new Point(a, b), new Point(g, h));
            }
        } else {
            [a, b, c, d] = a < c ? [a, b, c, d] : [c, d, a, b];
            [e, f, g, h] = e < g ? [e, f, g, h] : [g, h, e, f];

            if (a <= e && c >= g) {
                return this.geometryService.factory.edge(new Point(e, f), new Point(g, h));
            } else if (e <= a && g >= c) {
                return this.geometryService.factory.edge(new Point(a, b), new Point(c, d));
            } else if (a < e && c > e) {
                return this.geometryService.factory.edge(new Point(e, f), new Point(c, d));
            } else if (e < a && g > a) {
                return this.geometryService.factory.edge(new Point(a, b), new Point(g, h));
            }
        }


    }

    /**
     * Calculates the slope of the `Segment` or undefined if vertical line.
     */
    public getSlope(): number {
        if (this.points[0].x === this.points[1].x) {
            return undefined;
        }
        return (this.points[1].y - this.points[0].y) / (this.points[1].x - this.points[0].x);
    }

    public scale(scalePoint: Point): Segment {
        const point0 = this.points[0].scaleX(scalePoint.x).scaleY(scalePoint.y);
        const point1 = this.points[1].scaleX(scalePoint.x).scaleY(scalePoint.y);
        return this.geometryService.factory.edge(point0, point1);
    }

    public equalTo(otherLine: Segment): boolean {
        return otherLine.getPoints().find(point => point.equalTo(this.getPoints()[0])) !== undefined && otherLine.getPoints().find(point => point.equalTo(this.getPoints()[1])) !== undefined;
    }

    public getLength(): number {
        const xDistance = Math.abs(this.points[0].x - this.points[1].x);
        const yDistance = Math.abs(this.points[0].y - this.points[1].y);

        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    }

    public getB(): Point {
        return new Point(0, this.points[0].y - this.getSlope() * this.points[0].x);
    }

    public getLine(): Line {
        return Line.fromPointSlopeForm(this.points[0], this.getSlope());
    }

    public toString(): string {
        return `[${this.points[0].toString()},${this.points[1].toString()}]`;
    }
}