import { IEventListener } from "../listeners/IEventListener";
import { GameEvent } from "../GameEventManager";
import { GameFacade } from "../../GameFacade";
import { LifeCycleEvent } from "../triggers/ILifeCycleTrigger";
import { RouteObject } from "../../models/objects/RouteObject";
import { PathObject } from "../../models/objects/PathObject";
import { Point } from "../../../misc/geometry/shapes/Point";
import { AnimationCondition } from "../../../editor/views/canvas/models/meta/AnimationConcept";

const defaultSpeed = 1000 / 4;

export class RouteWalker implements IEventListener {
    events: GameEvent[];
    private gameFacade: GameFacade;
    private prevTime: number;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
        this.updateRoutes = this.updateRoutes.bind(this);

        this.events = [
            new GameEvent({lifeCycleEvent: LifeCycleEvent.AfterRender}, this.updateRoutes),
        ]
    }

    private updateRoutes() {
        const delta = this.computeDelta();
        const speed = delta / defaultSpeed;

        this.gameFacade.gameStore.getRouteObjects()
            .filter(route => route.isFinished === false && route.isPaused === false)
            .forEach(route => {
                const meshObj = route.getMeshObject();
                const pathObj = route.getPathObject();

                const direction =  pathObj.points[route.currentStop].subtract(meshObj.getPosition()).normalize();

                if (this.isNextStopReached(route)) {
                    if (pathObj.tree.get(route.currentStop).length === 0) {
                        route.reset();
                    } else {
                        route.currentStop = this.chooseRandomBranch(pathObj, route.currentStop);
                    }
                }

                meshObj.moveBy(direction.mul(speed));
                meshObj.setRotation(direction);
            });
    }

    private computeDelta(): number {
        const currentTime = Date.now();
        this.prevTime = this.prevTime === undefined ? currentTime : this.prevTime;

        const delta = currentTime - this.prevTime;

        this.prevTime = currentTime;

        return delta;
    }

    private isNextStopReached(route: RouteObject): boolean {
        const meshObj = route.getMeshObject();
        const pathObj = route.getPathObject();

        const meshPos = meshObj.getPosition();
        const currentStopPos = route.currentStop;

        return meshPos.distanceTo(pathObj.points[currentStopPos]) < 1;
    }

    private chooseRandomBranch(pathObj: PathObject, currentPoint: number) {
        const len = pathObj.tree.get(currentPoint).length;
        const randomBranch = Math.floor(Math.random() * len);

        return pathObj.tree.get(currentPoint)[randomBranch];
    }

    initRoutes() {
        this.gameFacade.gameStore.getRouteObjects().forEach(route => {
            const meshObj = route.getMeshObject();
            const pathObj = route.getPathObject();
            
            if (meshObj.animation) {
                meshObj.activeElementalAnimation = meshObj.animation.getAnimationByCond(AnimationCondition.Move);
            }
            meshObj.setPosition(pathObj.root);
        });
    }
}