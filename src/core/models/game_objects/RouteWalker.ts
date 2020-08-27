import { Point } from "../../../utils/geometry/shapes/Point";
import { Segment } from "../../../utils/geometry/shapes/Segment";
import { PathCorner } from "./PathCorner";
import { RouteModel, RouteEvent } from "./RouteModel";
import { PathView } from "../views/PathView";

const defaultSpeed = 1000 / 4;

export class RouteWalker {
    private prevTime: number;
    private bezierRotator = new BezierRotator();
    private isFinished = false;
    isStarted = false;

    private route: RouteModel;

    constructor(route: RouteModel) {
        this.route = route;
    }

    nextStep() {
        // if (route.currentGoal === undefined) {
        //     this.initRoute(route);
        // } else {
        // TODO: instead of this introduce 'isStarted' field
        if (!this.route.meshModel ) {
            return;
        }
        if (!this.isFinished) {
            this.moveRoute();
        }
        // }
    }

    reset() {
        const meshObj = this.route.meshModel.meshView;
        const pathObj = this.route.pathModel.pathView;

        if (!meshObj.obj.mesh) { return; }

        this.route.path = this.createPathCorners(pathObj);

        this.route.currentGoal = this.route.path[1];
        const rotation =  this.route.path[1].point1.subtract(this.route.path[0].point2).normalize().vectorAngle();

        meshObj.setPosition(this.route.path[0].point2);
        meshObj.setRotation(-rotation);
        this.isStarted = true;
    }

    private computeDelta(): number {
        const currentTime = Date.now();
        this.prevTime = this.prevTime === undefined ? currentTime : this.prevTime;

        const delta = currentTime - this.prevTime;

        this.prevTime = currentTime;

        return delta;
    }

    private getPointWithinRange(route: RouteModel): Point {
        const meshObj = route.meshModel.meshView;
        const meshPos = meshObj.getPosition();

        console.log(meshPos + '  ' + route.currentGoal.point1)

        if (route.currentGoal.point1 && meshPos.distanceTo(route.currentGoal.point1) < 1) {
            return route.currentGoal.point1;
        } else if (route.currentGoal.point2 && meshPos.distanceTo(route.currentGoal.point2) < 1) {
            return route.currentGoal.point2;
        }

        return undefined;
    }

    private moveRoute() {
        const delta = this.computeDelta();
        const speed = delta / defaultSpeed;

        const meshObj = this.route.meshModel.meshView;

        this.resetIfFianlPointReached(this.route);
        this.turnRoute();
        
        meshObj.moveForward(-speed);
    }

    private turnRoute() {
        const meshObj = this.route.meshModel.meshView;
        const pathObj = this.route.pathModel.pathView;

        if (this.route.isTurning) {
            const rotation = this.bezierRotator.getRotation(this.route.currentGoal, meshObj.getPosition());
            const nextGoal = this.route.path[this.route.path.indexOf(this.route.currentGoal) + 1];
            const finalRotation = nextGoal.point1.subtract(this.route.currentGoal.point2).normalize().vectorAngle();

            if (Math.abs(rotation - finalRotation) < 0.1) {
                meshObj.setRotation(-finalRotation);
                this.route.trigger(RouteEvent.TurnEnd);
                this.route.isTurning = false;
                const currentGoalIndex = this.route.path.indexOf(this.route.currentGoal);
                this.route.currentGoal = this.route.path[currentGoalIndex + 1];
            } else {
                meshObj.setRotation(-rotation);
            }
        } else {
            const rotation = this.route.currentGoal.point1.subtract(this.route.currentGoal.getPrevCorner().point2).normalize().vectorAngle();
            meshObj.setRotation(-rotation);
        }
    }

    private resetIfFianlPointReached(route: RouteModel) {
        const reachedPoint = this.getPointWithinRange(route);

        if (reachedPoint === route.currentGoal.point1) {
            if (route.currentGoal.point2) {
                route.isTurning = true;
                route.trigger(RouteEvent.TurnStart);
            } else {
                this.isFinished = true;
                route.trigger(RouteEvent.Finish);
                // this.initRoute(route);
            }
        }
    }

    private createPathCorners(pathObject: PathView): PathCorner[] {
        const pathCorners: PathCorner[] = [];
        const points = pathObject.editPoints.map(p => p.point).map(p => p.negateY()).map(point => point.div(10));

        const startCorner = new PathCorner(pathCorners);
        startCorner.point2 = points[0];
        for (let i = 1; i < points.length - 1; i++) {
            const corner: PathCorner = new PathCorner(pathCorners);
            let vector = new Segment(points[i - 1], points[i]).toVector().mul(0.9);
            corner.point1 = points[i - 1].clone().add(vector);
            corner.controlPoint = points[i];
            vector = new Segment(points[i], points[i + 1]).toVector().mul(0.1);
            corner.point2 = points[i].clone().add(vector);
        }
        const finalPoint = new PathCorner(pathCorners);
        finalPoint.point1 = points[points.length - 1];
        return pathCorners;
    }
}

class BezierRotator {
    getRotation(pathCorner: PathCorner, currentPoint: Point): number {
        const bezierPoint = this.getBezierPoint(pathCorner, currentPoint);

        return bezierPoint.subtract(currentPoint).normalize().vectorAngle();
    }

    private getBezierPoint(pathCorner: PathCorner, currentPoint: Point): Point {
        const ratio = this.getCurrentPointRatio(pathCorner, currentPoint);
        const bezierLine1 = new Segment(pathCorner.point1, pathCorner.controlPoint);
        const bezierPoint1 = bezierLine1.getPointAtRatio(ratio);
        const bezierLine2 = new Segment(pathCorner.controlPoint, pathCorner.point2);
        const bezierPoint2 = bezierLine2.getPointAtRatio(ratio);
        const connectedLine = new Segment(bezierPoint1, bezierPoint2);
        const connectedPoint = connectedLine.getPointAtRatio(ratio);

        return connectedPoint;
    }

    private getCurrentPointRatio(pathCorner: PathCorner, currentPoint: Point) {
        const point1Dist = currentPoint.distanceTo(pathCorner.point1);
        const fullDist = pathCorner.point1.distanceTo(pathCorner.point2);

        return point1Dist / fullDist;
    }
}