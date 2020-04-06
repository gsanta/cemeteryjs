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

    private isNextStopReached(route: RouteObject): boolean {
        const meshObj = route.getMeshObject();
        const meshPos = meshObj.getPosition();

        let point = route.isTurning ? route.currentGoal.point2 : route.currentGoal.point1;

        return meshPos.distanceTo(point) < 1;
    }

    private moveRoute(route: RouteObject) {
        const delta = this.computeDelta();
        const speed = delta / defaultSpeed;

        const meshObj = route.getMeshObject();
        const pathObj = route.getPathObject();

        
        if (this.isNextStopReached(route)) {
            if (route.currentGoal === route.path[route.path.length - 1]) {
                route.reset();
            } else {
                // const nextStop = this.chooseRandomBranch(pathObj, route.currentStop);
                const prevGoal = route.path[route.path.indexOf(route.currentGoal) - 1];
                const direction =  prevGoal.point2.subtract(route.currentGoal.point1).normalize();
                route.currentGoal = nextStop;
                meshObj.setRotation(direction);
            }
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

        route.currentGoal = 0;
        const direction =  route.path[1].point1.subtract(route.path[0].controlPoint).normalize();

        meshObj.setPosition(pathObj.root);
        meshObj.setRotation(direction);
    }

    private chooseRandomBranch(pathObj: PathObject, currentPoint: number) {
        const len = pathObj.tree.get(currentPoint).length;
        const randomBranch = Math.floor(Math.random() * len);

        return pathObj.tree.get(currentPoint)[randomBranch];
    }

    private createPathCorners(pathObject: PathObject): PathCorner[] {
        const pathCorners: PathCorner[] = [];
        pathCorners.push(new PathCorner(pathObject.points[0]));
        for (let i = 1; i < pathObject.points.length - 1; i++) {
            const corner: PathCorner = new PathCorner()
            let vector = new Segment(pathObject.points[i - 1], pathObject.points[i]).toVector().mul(0.9);
            corner.point1 = pathObject.points[i - 1].clone().add(vector);
            corner.controlPoint = pathObject.points[i];
            vector = new Segment(pathObject.points[i], pathObject.points[i + 1]).toVector().mul(0.1);
            corner.point2 = pathObject.points[i].clone().add(vector);
        }
        pathCorners.push(new PathCorner(pathObject.points[pathObject.points.length - 1]));
        return pathCorners;
    }
}