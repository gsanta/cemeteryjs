import { AnimationCondition } from "../../../core/models/meta/AnimationConcept";
import { Point } from "../../../core/geometry/shapes/Point";
import { Segment } from "../../../core/geometry/shapes/Segment";
import { PathCorner } from "../../models/objects/PathCorner";
import { RouteObject } from "../../models/objects/RouteObject";
import { PathView } from "../../../core/models/views/PathView";
import { toDegree } from "../../../core/geometry/utils/Measurements";

const defaultSpeed = 1000 / 4;

export class RouteWalker {
    private prevTime: number;
    private bezierRotator = new BezierRotator();

    walk(route: RouteObject) {
        if (route.currentGoal === undefined) {
            this.initRoute(route);
        } else {
            this.moveRoute(route);
        }
    }

    private computeDelta(): number {
        const currentTime = Date.now();
        this.prevTime = this.prevTime === undefined ? currentTime : this.prevTime;

        const delta = currentTime - this.prevTime;

        this.prevTime = currentTime;

        return delta;
    }

    private getPointWithinRange(route: RouteObject): Point {
        const meshObj = route.getMeshObject();
        const meshPos = meshObj.getPosition();

        if (route.currentGoal.point1 && meshPos.distanceTo(route.currentGoal.point1) < 1) {
            return route.currentGoal.point1;
        } else if (route.currentGoal.point2 && meshPos.distanceTo(route.currentGoal.point2) < 1) {
            return route.currentGoal.point2;
        }

        return undefined;
    }

    private moveRoute(route: RouteObject) {
        const delta = this.computeDelta();
        const speed = delta / defaultSpeed;

        const meshObj = route.getMeshObject();

        this.resetIfFianlPointReached(route);
        this.turnRoute(route);
        
        meshObj.moveForward(-speed);
    }

    private turnRoute(route: RouteObject) {
        // if (route.isTurning) {
        //     const rotation = this.bezierRotator.getRotation(route.currentGoal, route.getMeshObject().getPosition());
        //     route.getMeshObject().rotate(route.getMeshObject().getRotation() - rotation);

        //     if (route.getMeshObject().animation) {
        //         route.getMeshObject().activeElementalAnimation = route.getMeshObject().animation.getAnimationByCond(AnimationCondition.Move);
        //     }
        //     route.isTurning = false;
        //     const currentGoalIndex = route.path.indexOf(route.currentGoal);
        //     route.currentGoal = route.path[currentGoalIndex + 1];
        // } else {
        // }
        const rotation = route.currentGoal.point1.subtract(route.currentGoal.getPrevCorner().point2).normalize().vectorAngle();
        console.log(toDegree(rotation))
        route.getMeshObject().setRotation(-rotation);
    }

    private resetIfFianlPointReached(route: RouteObject) {
        const reachedPoint = this.getPointWithinRange(route);

        if (reachedPoint === route.currentGoal.point1) {
            if (route.currentGoal.point2) {
                route.isTurning = true;
                if (route.getMeshObject().animation) {
                    route.getMeshObject().activeElementalAnimation = route.getMeshObject().animation.getAnimationByCond(AnimationCondition.RotateLeft);
                }
            } else {
                this.initRoute(route);
            }
        }
    }

    private initRoute(route: RouteObject) {
        const meshObj = route.getMeshObject();
        const pathObj = route.getPathObject();
        if (!meshObj.mesh) { return; }
        
        if (meshObj.animation) {
            meshObj.activeElementalAnimation = meshObj.animation.getAnimationByCond(AnimationCondition.Move);
        }

        route.path = this.createPathCorners(pathObj);

        route.currentGoal = route.path[1];
        const rotation =  route.path[1].point1.subtract(route.path[0].point2).normalize().vectorAngle();

        meshObj.setPosition(pathObj.editPoints[0].point);
        // meshObj.setRotation(rotation);
        route.getMeshObject().setRotation(-rotation);
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