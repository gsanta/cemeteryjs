import { IEventListener } from "../listeners/IEventListener";
import { GameEvent } from "../GameEventManager";
import { GameFacade } from "../../GameFacade";
import { LifeCycleEvent } from "../triggers/ILifeCycleTrigger";
import { RouteObject } from "../../models/objects/RouteObject";
import { PathObject, PathCorner } from "../../models/objects/PathObject";
import { Point } from "../../../misc/geometry/shapes/Point";
import { AnimationCondition } from "../../../editor/views/canvas/models/meta/AnimationConcept";
import { Vector3 } from "babylonjs";
import { Segment } from "../../../misc/geometry/shapes/Segment";

const defaultSpeed = 1000 / 4;

export class RouteWalker implements IEventListener {
    events: GameEvent[];
    private gameFacade: GameFacade;
    private prevTime: number;
    private started = false;
    private bezierRotator = new BezierRotator();

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
        this.updateRoutes = this.updateRoutes.bind(this);

        this.events = [
            new GameEvent({lifeCycleEvent: LifeCycleEvent.AfterRender}, this.updateRoutes),
        ]
    }

    start() {
        this.started = true;
    }

    private updateRoutes() {
        if (!this.started) { return }

        this.gameFacade.gameStore.getRouteObjects()
            .filter(route => {
                const meshObj = route.getMeshObject();

                return route.isFinished === false && route.isPaused === false && meshObj.hasMesh()
            })
            .forEach(route => this.updateRoute(route));
    }

    private computeDelta(): number {
        const currentTime = Date.now();
        this.prevTime = this.prevTime === undefined ? currentTime : this.prevTime;

        const delta = currentTime - this.prevTime;

        this.prevTime = currentTime;

        return delta;
    }

    private updateRoute(route: RouteObject) {
        if (route.currentGoal === undefined) {
            this.initRoute(route);
        } else {
            this.moveRoute(route);
        }
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

        const reachedPoint = this.getPointWithinRange(route);

        if (reachedPoint === route.currentGoal.point1) {

            if (route.currentGoal.point2) {
                route.isTurning = true;
            } else {
                this.initRoute(route);
            }
        } else if (reachedPoint === route.currentGoal.point2) {
            // console.log('reachedPoint index: ' + route.path.indexOf(route.currentGoal));
            // // route.isTurning = false;
            // const currentGoalIndex = route.path.indexOf(route.currentGoal);
            // if (currentGoalIndex === route.path.length - 1) {
            //     this.initRoute(route);
            // } else {
            //     route.currentGoal = route.path[currentGoalIndex + 1];
            // }
        }

        if (route.isTurning) {
            const rotation = this.bezierRotator.getRotation(route.currentGoal, meshObj.getPosition());
            const nextGoal = route.path[route.path.indexOf(route.currentGoal) + 1];
            const finalRotation = nextGoal.point1.subtract(route.currentGoal.point2).normalize().vectorAngle();

            if (Math.abs(rotation - finalRotation) < 0.1) {
                meshObj.setRotation(finalRotation);
                route.isTurning = false;
                const currentGoalIndex = route.path.indexOf(route.currentGoal);
                route.currentGoal = route.path[currentGoalIndex + 1];
            } else {
                meshObj.setRotation(rotation);
            }
        } else {
            const prevGoal = route.path[route.path.indexOf(route.currentGoal) - 1];
            const rotation = route.currentGoal.point1.subtract(prevGoal.point2).normalize().vectorAngle();
            meshObj.setRotation(rotation);
        }
        
        meshObj.moveBy(new Point(0, -1).mul(speed));
    }

    private initRoute(route: RouteObject) {
        const meshObj = route.getMeshObject();
        const pathObj = route.getPathObject();
        
        if (meshObj.animation) {
            meshObj.activeElementalAnimation = meshObj.animation.getAnimationByCond(AnimationCondition.Move);
        }

        route.path = this.createPathCorners(pathObj);

        route.currentGoal = route.path[1];
        const direction =  route.path[1].point1.subtract(route.path[0].point2).normalize().vectorAngle();

        meshObj.setPosition(pathObj.root);
        meshObj.setRotation(direction);
    }

    private createPathCorners(pathObject: PathObject): PathCorner[] {
        const pathCorners: PathCorner[] = [];

        const startCorner = new PathCorner();
        startCorner.point2 = pathObject.points[0];
        pathCorners.push(startCorner);
        for (let i = 1; i < pathObject.points.length - 1; i++) {
            const corner: PathCorner = new PathCorner()
            let vector = new Segment(pathObject.points[i - 1], pathObject.points[i]).toVector().mul(0.9);
            corner.point1 = pathObject.points[i - 1].clone().add(vector);
            corner.controlPoint = pathObject.points[i];
            vector = new Segment(pathObject.points[i], pathObject.points[i + 1]).toVector().mul(0.1);
            corner.point2 = pathObject.points[i].clone().add(vector);
            pathCorners.push(corner);
        }
        pathCorners.push(new PathCorner(pathObject.points[pathObject.points.length - 1]));
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