import { PathObj } from "../../../../../core/models/objs/PathObj";
import { BezierCurve } from "./BezierCurve";
import { LineSegment } from "../../../../../utils/geometry/shapes/LineSegment";
import { Point } from "../../../../../utils/geometry/shapes/Point";

export class BezierCurvePath {
    private pathObj: PathObj;
    private points: Point[];

    // how far away the bezier curve should start relative to the control point (the control point is the existing path point)
    private bezierDelta: number = 5;

    constructor(pathObj: PathObj) {
        this.pathObj = pathObj;
    }

    getPoints(): Point[] {
        if (!this.points) { this.points = this.createPoints(); }

        return this.points;
    }

    private createPoints(): Point[] {
        const pathPoints = this.pathObj.points;

        if (pathPoints.length <= 1) { 
            return pathPoints;
        } else {
            const middlePoints: Point[] = [];
            
            for (let i = 1; i < pathPoints.length - 1; i++) {
                const newPoints = this.createBezierPointsForPathPoint(pathPoints[i], pathPoints[i - 1], pathPoints[i + 1]);
                middlePoints.push(...newPoints);
            }
    
            return [pathPoints[0], ...middlePoints, pathPoints[pathPoints.length - 1]];
        }
    }

    private createBezierPointsForPathPoint(currPoint: Point, prevPoint: Point, nextPoint: Point) {
        const line1 = new LineSegment(prevPoint, currPoint);
        const t1 = (line1.getLength() - this.bezierDelta) / line1.getLength();
        const point1 = line1.getPointAtRatio(t1);

        const controlPoint = currPoint;

        const line2 = new LineSegment(currPoint, nextPoint);
        const t2 = this.bezierDelta / line2.getLength();
        const point2 = line2.getPointAtRatio(t2);

        let bezierCurvePoints = new BezierCurve([point1, controlPoint, point2]).getPoints();
        return bezierCurvePoints;
    }

}