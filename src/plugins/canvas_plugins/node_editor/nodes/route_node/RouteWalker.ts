import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { PathObj } from "../../../../../core/models/objs/PathObj";
import { FiniteLine } from "../../../../../utils/geometry/shapes/FiniteLine";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { BezierCurve } from "./BezierCurve";

const speedConstant = 250;

export class RouteWalker {
    private meshObj: MeshObj;
    private pathObj: PathObj;
    private prevTime: number;
    private currentPointIndex: number = -1;
    private currentPosition: Point;
    private distance: number;
    private progress: number = 0;
    private points: Point[];
    private bezierPoints: BezierCurve[] = [];
    private prevDistance: number = Number.MAX_VALUE;

    private speed = 1;
    private vector: Point;

    constructor(meshObj: MeshObj, pathObj: PathObj) {
        this.meshObj = meshObj;
        this.pathObj = pathObj;
        this.points = this.pathObj.points;

        this.bezierPoints = this.createBezierPoints(this.points);
    }

    private createBezierPoints(pathPoints: Point[]) {
        if (pathPoints.length === 0) { return []; }
        
        const bezierPoints: BezierCurve[] = [];
        if (pathPoints.length >= 1) {
            bezierPoints.push(new BezierCurve([pathPoints[0]]));
        }
        
        if (pathPoints.length >= 2) {
            bezierPoints.push(new BezierCurve([pathPoints[pathPoints.length - 1]]));
        }

        const dist = 10;
        for (let i = 1; i < pathPoints.length - 1; i++) {
            const line1 = new FiniteLine(pathPoints[i - 1], pathPoints[i]);
            const t1 = (line1.getLength() - dist) / line1.getLength();
            const point1 = line1.getPointAtRatio(t1);

            const point2 = pathPoints[i];

            const line2 = new FiniteLine(pathPoints[i], pathPoints[i + 1]);
            const t2 = dist / line2.getLength();
            const point3 = line2.getPointAtRatio(t2);

            bezierPoints.push(new BezierCurve([point1, point2, point3]));
        }
    }

    step() {
        const delta = this.computeDelta() * this.speed / speedConstant;
        this.progress += delta;
        
        const pos2 = this.calcPosition();

        this.updateControlPoint();
        console.log('delta: ' + this.progress + ' len: ' + this.vector.len());


        this.meshObj.setPosition(new Point_3(pos2.x, this.meshObj.getPosition().y, pos2.y));
    }

    start() {
        this.prevTime = undefined;
    }

    setSpeed(speed: number) {
        this.speed = speed;
    }

    private updateControlPoint() {
        const newDistance: number = this.points[this.currentPointIndex].distanceTo(this.currentPosition);
        if (this.currentPointIndex === -1 || this.prevDistance < newDistance) {
            this.prevDistance = Number.MAX_VALUE;

            if (this.currentPointIndex === this.points.length - 2) {
                this.currentPointIndex = 0;
            } else {
                this.currentPointIndex += 1;
            }

            this.vector = this.points[this.currentPointIndex + 1].subtract(this.points[this.currentPointIndex]);
            const angle = this.vector.angleToOrigin();
            this.meshObj.setRotation(angle);

            this.distance = this.vector.len();
        }
    }

    private calcPosition(): Point {
        const currentPoint = this.points[this.currentPointIndex];

        return currentPoint.clone().add(this.vector.clone().mul(this.progress / this.distance));
    }

    private computeDelta(): number {
        const currentTime = Date.now();
        this.prevTime = this.prevTime === undefined ? currentTime : this.prevTime;

        const delta = currentTime - this.prevTime;

        this.prevTime = currentTime;

        return delta;
    }

}