import { IEventListener } from "../listeners/IEventListener";
import { GameEvent } from "../GameEventManager";
import { GameFacade } from "../../GameFacade";
import { LifeCycleEvent } from "../triggers/ILifeCycleTrigger";
import { RouteObject } from "../../models/objects/RouteObject";
import { PathObject } from "../../models/objects/PathObject";
import { Point } from "../../../misc/geometry/shapes/Point";
import { AnimationCondition } from "../../../editor/views/canvas/models/meta/AnimationConcept";
import { Vector3 } from "babylonjs";

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
        if (route.currentStop === undefined) {
            this.initRoute(route);
        } else {
            this.moveRoute(route);
        }
    }

    private isNextStopReached(route: RouteObject): boolean {
        const meshObj = route.getMeshObject();
        const pathObj = route.getPathObject();

        const meshPos = meshObj.getPosition();
        const currentStopPos = route.currentStop;

        return meshPos.distanceTo(pathObj.points[currentStopPos]) < 1;
    }

    private moveRoute(route: RouteObject) {
        const delta = this.computeDelta();
        const speed = delta / defaultSpeed;

        const meshObj = route.getMeshObject();
        const pathObj = route.getPathObject();

        
        if (this.isNextStopReached(route)) {
            if (pathObj.tree.get(route.currentStop).length === 0) {
                route.reset();
            } else {
                const currentStop = route.currentStop;
                const nextStop = this.chooseRandomBranch(pathObj, route.currentStop);
                const direction =  pathObj.points[nextStop].subtract(pathObj.points[currentStop]).normalize();
                route.currentStop = nextStop;
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

        route.currentStop = this.chooseRandomBranch(pathObj, 0);
        const direction =  pathObj.points[route.currentStop].subtract(pathObj.points[0]).normalize();

        meshObj.setPosition(pathObj.root);
        meshObj.setRotation(direction);
    }

    private chooseRandomBranch(pathObj: PathObject, currentPoint: number) {
        const len = pathObj.tree.get(currentPoint).length;
        const randomBranch = Math.floor(Math.random() * len);

        return pathObj.tree.get(currentPoint)[randomBranch];
    }
}