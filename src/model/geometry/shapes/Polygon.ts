import booleanContains from '@turf/boolean-contains';
import booleanOverlaps from '@turf/boolean-overlap';
import * as turfHelpers from '@turf/helpers';
import polylabel from 'polylabel';
import { GeometryService } from '../GeometryService';
import { every, maxBy, minBy } from '../utils/Functions';
import { Point } from './Point';
import { Segment } from './Segment';
import { BoundingInfo, Shape, ShapeOrigin } from './Shape';


export class Polygon implements Shape {
    protected points: Point[];
    protected orederedPoints: Point[];
    private geometryService: GeometryService;

    constructor(points: Point[], geometryService: GeometryService = new GeometryService()) {
        this.points = points;
        this.geometryService = geometryService;
        this.orederedPoints = this.orderPointsToStartAtBottomLeft(this.points);
        this.points = this.orederedPoints;
        if (!this.arePointsClockwise()) {
            this.orederedPoints = this.orderPointsToStartAtBottomLeft(this.orederedPoints.reverse());
        }
    }

    public getPoints(): Point[] {
        return this.orederedPoints;
    }

    public setPoint(index: number, newPoint: Point): Polygon {
        const clonedPoints = [...this.points];
        clonedPoints.splice(index, 1, newPoint);

        return new Polygon(clonedPoints);
    }

    public hasPoint(point: Point): boolean {
        return this.points.find(p => p.equalTo(point)) !== undefined;
    }

    public getPointsStartingFrom(point: Point) {
        const index = this.getIndexOf(point);

        return [...this.getPoints().slice(index), this.getPoints().slice(0, index)];
    }

    public getIndexOf(point: Point): number {
        return this.orederedPoints.findIndex(p => p.equalTo(point));
    }

    /**
     * The ordering of points within a `Shape` are stable (it is the order by which the `Polygon` was instantiated), and it returns with the previous `Point` based
     * on that order. The `Polygon` is a circular shape so whatever the index is, a valid `Point` will be returned.
     */
    public getPreviousPoint(point: Point): Point {
        const index = this.getIndexOf(point);

        if (index === 0) {
            return this.orederedPoints[this.points.length - 1];
        }

        return this.orederedPoints[index - 1];
    }

    public getNextPoint(point: Point): Point {
        const index = this.getIndexOf(point);
        if (index === this.orederedPoints.length - 1) {
            return this.orederedPoints[0];
        }

        return this.orederedPoints[index + 1];
    }

    public getOrderedIndex(point: Point) {
        const p = this.orederedPoints.find(p => p.equalTo(point));
        return this.orederedPoints.indexOf(p);
    }

    public translate(point: Point): Polygon {
        const translatedPoints = this.points.map(p => p.addX(point.x).addY(point.y));
        return new Polygon(translatedPoints);
    }

    public negate(axis: 'x' | 'y'): Polygon {
        const translatedPoints = this.points.map(point => new Point(axis === 'x' ? -point.x : point.x, axis === 'y' ? -point.y : point.y));
        return new Polygon(translatedPoints);
    }

    public getArea() {
        let area = 0;
        let prevIndex = this.points.length - 1;

        for (let i = 0; i < this.points.length; i++) {
            area = area +  (this.points[prevIndex].x + this.points[i].x) * (this.points[prevIndex].y - this.points[i].y);
            prevIndex = i;
        }

        return Math.abs(area / 2);
        let depth: number;
    }

    public clone(): Polygon {
        const points = this.points.map(point => point.clone());

        const clone = new Polygon(points);

        return clone;
    }

    containsPoint(point: Point): boolean {
        const poly = turfHelpers.polygon([this.toLinearRing().toTwoDimensionalArray()]);
        const p = turfHelpers.point([point.x, point.y]);

        return booleanContains(poly, p);
    }

    public contains(other: Polygon): boolean {
        const poly1 = turfHelpers.polygon([this.toLinearRing().toTwoDimensionalArray()]);
        const poly2 = turfHelpers.polygon([other.toLinearRing().toTwoDimensionalArray()]);

        return booleanContains(poly1, poly2);
    }

    public intersect(other: Polygon): boolean {
        const poly1 = turfHelpers.polygon([this.toLinearRing().toTwoDimensionalArray()]);
        const poly2 = turfHelpers.polygon([other.toLinearRing().toTwoDimensionalArray()]);

        return booleanOverlaps(poly1, poly2);
    }

    public scale(amount: Point): Polygon {
        const points = this.points.map(p => p.scaleX(amount.x)).map(p => p.scaleY(amount.y));
        return new Polygon(points);
    }

    /**
     * Returns the center `Point` of the bounding `Rectangle`
     */
    public getBoundingCenter(): Point {
        const center = polylabel([this.toTwoDimensionalArray()], 1.0);
        return new Point(center[0], center[1]);
    }

    public getBoundingRectangle(): Shape {
        const boudingInfo = this.getBoundingInfo();
        const minX = boudingInfo.min[0];
        const maxX = boudingInfo.max[0];
        const minY = boudingInfo.min[1];
        const maxY = boudingInfo.max[1];

        return new Polygon([
            new Point(minX, minY),
            new Point(minX, maxY),
            new Point(maxX, maxY),
            new Point(maxX, minY)
        ]);
    }

    public setPosition(point: Point, origin: ShapeOrigin = ShapeOrigin.CENTER): Polygon {
        if (this.points.length !== 4) {
            throw new Error('setPosition is only supported for Rectangles.');
        }

        const boudingInfo = this.getBoundingRectangle().getBoundingInfo();

        const width = boudingInfo.max[0] - boudingInfo.min[0]
        const height = boudingInfo.max[1] - boudingInfo.min[1];

        return this.geometryService.factory.rectangle(point.x - width / 2, point.y - height / 2, width, height);
    }

    /**
     * @deprecated use `getEdges` instead, it has the same behaviour, but a more unified naming convention
     */
    public getSidesFromBottomLeftClockwise(): Segment[] {
        return this.orederedPoints.map((point, index) => {
            if (index < this.orederedPoints.length - 1) {
                return this.geometryService.factory.edge(point, this.orederedPoints[index + 1]);
            } else {
                return this.geometryService.factory.edge(point, this.orederedPoints[0]);
            }
        });
    }

    /**
     * Determines which sides (if any) of the `Polygon` lies on the same line as the given `Segment` segment.
     * @returns an array of the following structure: the `Segment` segment representing the side of the `Polygon` and the index of that side
     *      being the 0 index the bottom left side and counting clockwise.
     */
    public getCoincidingSidesForLine(line: Segment): [Segment, number][] {
        const sides = this.getSidesFromBottomLeftClockwise();

        return sides
            .filter(side => side.isCoincidentToLine(line))
            .map(side => [side, sides.indexOf(side)]);
    }

    public getCoincidentLineSegment(other: Shape): [Segment, number, number] {
        const otherEdges = other.getEdges();
        const thisEdges = this.getEdges();

        let coincidentSegmentInfos: [Segment, number, number][] = [];
        for (let i = 0; i < otherEdges.length; i++) {
            for (let j = 0; j < thisEdges.length; j++) {
                const coincidentInfo = otherEdges[i].getCoincidentLineSegment(thisEdges[j]);
                if (coincidentInfo) {
                    coincidentSegmentInfos.push([coincidentInfo[0], j, i]);
                }
            }
        }

        return maxBy<[Segment, number, number]>(coincidentSegmentInfos, (a, b) => a[0].getLength() - b[0].getLength());
    }

    public getBoundingInfo(): BoundingInfo {
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

    public getEdges(): Segment[] {
        return this.getSidesFromBottomLeftClockwise();
    }

    public equalTo(otherPolygon: Polygon): boolean {
        if (this.points.length !== otherPolygon.points.length) {
            return false;
        }

        return every(this.orederedPoints, (point, index) => point.equalTo(otherPolygon.orederedPoints[index]));
    }

    public removeStraightVertices(): Polygon {
        const firstPoint: Point = this.getPoints().find(point => {
            const a = point;
            const b = this.getPreviousPoint(point);
            const c = this.getNextPoint(point);
            return this.geometryService.factory.angleFromThreePoints(a, b, c).isStraightAngle() === false
        });

        const reducedPoints: Point[] = [firstPoint];


        let currentPoint = this.getNextPoint(firstPoint);
        while(currentPoint.equalTo(firstPoint) === false) {
            const a = currentPoint;
            const b = this.getPreviousPoint(currentPoint);
            const c = this.getNextPoint(currentPoint);

            if (this.geometryService.factory.angleFromThreePoints(a, b, c).isStraightAngle() === false) {
                reducedPoints.push(currentPoint);
            }

            currentPoint = this.getNextPoint(currentPoint);
        }

        return new Polygon(reducedPoints);
    }

    public toString(): string {
        let str = '['

        this.points.forEach(point => str += point.toString());

        str += ']';

        return str;
    }

    public static createRectangle(left: number, top: number,  width: number, height: number, geometryService: GeometryService = new GeometryService()): Polygon {
        const minX = left;
        const maxX = left + width;
        const minY = top;
        const maxY = top + height;

        return new Polygon([
            geometryService.factory.point(minX, minY),
            geometryService.factory.point(minX, maxY),
            geometryService.factory.point(maxX, maxY),
            geometryService.factory.point(maxX, minY)
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

    private arePointsClockwise() {
        const edges = this.getEdges();

        const sum = edges.reduce(
            (sum: number, nextEdge) => {
                const point1 = nextEdge.getPoints()[0];
                const point2 = nextEdge.getPoints()[1];
                return sum + (point2.x - point1.x) * (point2.y + point1.y);
            },
            0
        );

        return sum >= 0;
    }

    private orderPointsToStartAtBottomLeft = (points: Point[]) => {
        const minY = minBy<Point>(points, (a, b) => a.y - b.y).y;

        const poinstWithYEqualToMinY = points.filter(point => this.geometryService.measuerments.coordinatesEqual(point.y, minY))
        const bottomLeftPoint = minBy<Point>(poinstWithYEqualToMinY, (a, b) => a.x - b.x);

        while (!points[0].equalTo(bottomLeftPoint)) {
            points.push(points.shift());
        }

        return points;
    }
}