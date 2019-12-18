import { Line } from './shapes/Line';
import { Point } from "./shapes/Point";
import { Polygon } from "./shapes/Polygon";
import { Segment } from "./shapes/Segment";
import { GeometryService } from './GeometryService';
import { Angle } from './shapes/Angle';


export class GeometryFactory {
    private geometryService: GeometryService

    constructor(geometryService: GeometryService) {
        this.geometryService = geometryService;
    }

    lineFromTwoPoints(point1: Point, point2: Point): Line {
        return Line.fromTwoPoints(point1, point2)
    }

    lineFromPointSlopeForm(point: Point, slope: number): Line {
        return Line.fromPointSlopeForm(point, slope);
    }

    lineVertical(x: number) {
        return Line.createVerticalLine(x);
    }

    lineHorizontal(y: number) {
        return Line.createHorizontalLine(y);
    }

    polygon(points: Point[]): Polygon {
        return new Polygon(points);
    }

    rectangle(left: number, top: number,  width: number, height: number): Polygon {
        return Polygon.createRectangle(left, top, width, height, this.geometryService);
    }

    edge(endPoint1: Point, endPoint2: Point): Segment {
        return new Segment(endPoint1, endPoint2);
    }

    point(x: number, y: number): Point {
        return new Point(x, y);
    }

    angleFromRadian(angle: number): Angle {
        return Angle.fromRadian(angle);
    }

    angleFromThreePoints(o: Point, a: Point, b: Point) {
        return Angle.fromThreePoints(o, a, b);
    }

    angleFromTwoLines(line1: Line, line2: Line) {
        return Angle.fromTwoLines(line1, line2, this.geometryService);
    }
}