import booleanContains from '@turf/boolean-contains';
import booleanOverlaps from '@turf/boolean-overlap';
import * as turfHelpers from '@turf/helpers';
import polylabel from 'polylabel';
import { Point } from './Point';
import { LineSegment } from './LineSegment';
import { BoundingInfo, Shape, ShapeOrigin } from './Shape';
import { Angle } from './Angle';
import { Measurements } from '../Measurements';
import { minBy, maxBy, every } from '../Functions';
import { Rectangle } from './Rectangle';


export class Polygon implements Shape {
    protected points: Point[];
    protected orederedPoints: Point[];

    constructor(points: Point[]) {
        this.points = points;
        this.orederedPoints = this.orderPointsToStartAtBottomLeft(this.points);
        this.points = this.orederedPoints;
    }

    getPoints(): Point[] {
        return this.orederedPoints;
    }

    getPointsStartingFrom(point: Point) {
        const index = this.getIndexOf(point);

        return [...this.getPoints().slice(index), this.getPoints().slice(0, index)];
    }

    getIndexOf(point: Point): number {
        return this.orederedPoints.findIndex(p => p.equalTo(point));
    }

    /**
     * The ordering of points within a `Shape` are stable (it is the order by which the `Polygon` was instantiated), and it returns with the previous `Point` based
     * on that order. The `Polygon` is a circular shape so whatever the index is, a valid `Point` will be returned.
     */
    getPreviousPoint(point: Point): Point {
        const index = this.getIndexOf(point);

        if (index === 0) {
            return this.orederedPoints[this.points.length - 1];
        }

        return this.orederedPoints[index - 1];
    }

    getNextPoint(point: Point): Point {
        const index = this.getIndexOf(point);
        if (index === this.orederedPoints.length - 1) {
            return this.orederedPoints[0];
        }

        return this.orederedPoints[index + 1];
    }

    getOrderedIndex(point: Point) {
        const p = this.orederedPoints.find(p => p.equalTo(point));
        return this.orederedPoints.indexOf(p);
    }

    translate(point: Point): Polygon {
        const translatedPoints = this.points.map(p => p.addX(point.x).addY(point.y));
        return new Polygon(translatedPoints);
    }

    getArea() {
        let area = 0;
        let prevIndex = this.points.length - 1;

        for (let i = 0; i < this.points.length; i++) {
            area = area +  (this.points[prevIndex].x + this.points[i].x) * (this.points[prevIndex].y - this.points[i].y);
            prevIndex = i;
        }

        return Math.abs(area / 2);
        let depth: number;
    }

    clone(): Polygon {
        const points = this.points.map(point => point.clone());

        const clone = new Polygon(points);

        return clone;
    }

    containsPoint(point: Point): boolean {
        const poly = turfHelpers.polygon([this.toLinearRing().toTwoDimensionalArray()]);
        const p = turfHelpers.point([point.x, point.y]);

        return booleanContains(poly, p);
    }

    contains(other: Polygon): boolean {
        const poly1 = turfHelpers.polygon([this.toLinearRing().toTwoDimensionalArray()]);
        const poly2 = turfHelpers.polygon([other.toLinearRing().toTwoDimensionalArray()]);

        return booleanContains(poly1, poly2);
    }

    intersect(other: Polygon): boolean {
        const poly1 = turfHelpers.polygon([this.toLinearRing().toTwoDimensionalArray()]);
        const poly2 = turfHelpers.polygon([other.toLinearRing().toTwoDimensionalArray()]);

        return booleanOverlaps(poly1, poly2);
    }

    scale(amount: Point): Polygon {
        const points = this.points.map(p => p.scaleX(amount.x)).map(p => p.scaleY(amount.y));
        return new Polygon(points);
    }

    /**
     * Returns the center `Point` of the bounding `Rectangle`
     */
    getBoundingCenter(): Point {
        const center = polylabel([this.toTwoDimensionalArray()], 1.0);
        return new Point(center[0], center[1]);
    }

    getBoundingRectangle(): Rectangle {
        const boudingInfo = this.getBoundingInfo();
        const minX = boudingInfo.min[0];
        const maxX = boudingInfo.max[0];
        const minY = boudingInfo.min[1];
        const maxY = boudingInfo.max[1];

        return new Rectangle(new Point(minX, minY), new Point(maxX, maxY));
    }

    /**
     * @deprecated use `getEdges` instead, it has the same behaviour, but a more unified naming convention
     */
    getSidesFromBottomLeftClockwise(): LineSegment[] {
        return this.orederedPoints.map((point, index) => {
            if (index < this.orederedPoints.length - 1) {
                return new LineSegment(point, this.orederedPoints[index + 1]);
            } else {
                return new LineSegment(point, this.orederedPoints[0]);
            }
        });
    }

    getBoundingInfo(): BoundingInfo {
        const minX = minBy<Point>(this.points, (a, b) => a.x - b.x).x;
        const maxX = maxBy<Point>(this.points, (a, b) => a.x - b.x).x;
        const minY = minBy<Point>(this.points, (a, b) => a.y - b.y).y;
        const maxY = maxBy<Point>(this.points, (a, b) => a.y - b.y).y;

        return {
            min: [minX, minY],
            max: [maxX, maxY],
            extent: [maxX - minX, maxY - minY]
        };
    }

    equalTo(otherPolygon: Polygon): boolean {
        if (this.points.length !== otherPolygon.points.length) {
            return false;
        }

        return every(this.orederedPoints, (point, index) => point.equalTo(otherPolygon.orederedPoints[index]));
    }

    removeStraightVertices(): Polygon {
        const firstPoint: Point = this.getPoints().find(point => {
            const a = point;
            const b = this.getPreviousPoint(point);
            const c = this.getNextPoint(point);
            return Angle.fromThreePoints(a, b, c).isStraightAngle() === false
        });

        const reducedPoints: Point[] = [firstPoint];


        let currentPoint = this.getNextPoint(firstPoint);
        while(currentPoint.equalTo(firstPoint) === false) {
            const a = currentPoint;
            const b = this.getPreviousPoint(currentPoint);
            const c = this.getNextPoint(currentPoint);

            if (Angle.fromThreePoints(a, b, c).isStraightAngle() === false) {
                reducedPoints.push(currentPoint);
            }

            currentPoint = this.getNextPoint(currentPoint);
        }

        return new Polygon(reducedPoints);
    }

    toString(): string {
        let str = '['

        const points = this.points.map(point => point.toString()).join(',');

        str += ']';

        return `[${points}]`;
    }

    static createRectangle(left: number, top: number,  width: number, height: number): Polygon {
        const minX = left;
        const maxX = left + width;
        const minY = top;
        const maxY = top + height;

        return new Polygon([
            new Point(minX, minY),
            new Point(minX, maxY),
            new Point(maxX, maxY),
            new Point(maxX, minY)
        ]);
    }

    private toTwoDimensionalArray(): number[][] {
        return <number[][]> this.points.map(point => [point.x, point.y]);
    }

    private toLinearRing(): Polygon {
        const clone = this.clone();
        clone.points.push(clone.points[0]);
        return clone;
    }

    private orderPointsToStartAtBottomLeft = (points: Point[]) => {
        const minY = minBy<Point>(points, (a, b) => a.y - b.y).y;

        const poinstWithYEqualToMinY = points.filter(point => new Measurements().coordinatesEqual(point.y, minY))
        const bottomLeftPoint = minBy<Point>(poinstWithYEqualToMinY, (a, b) => a.x - b.x);

        while (!points[0].equalTo(bottomLeftPoint)) {
            points.push(points.shift());
        }

        return points;
    }
}