import { IEventListener } from "../listeners/IEventListener";
import { GameEvent } from "../GameEventManager";
import { GameFacade } from "../../GameFacade";
import { LifeCycleEvent } from "../triggers/ILifeCycleTrigger";
import { RouteObject } from "../../models/objects/RouteObject";

const defaultSpeed = 1000 / 5;

export class RouteWalker implements IEventListener {
    events: GameEvent[];
    private gameFacade: GameFacade;
    private prevTime: number;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
        this.updateRoutes = this.updateRoutes.bind(this);
        // this.initRoutes();

        this.events = [
            new GameEvent({lifeCycleEvent: LifeCycleEvent.AfterRender}, this.updateRoutes),
            // new GameEvent({lifeCycleEvent: LifeCycleEvent.Reset}, this.initRoutes)
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

                this.isNextStopReached(route) && route.currentStop++;
                // route.currentStop === pathObj.points.length && (route.isFinished = true);

                if (route.currentStop === pathObj.points.length) {
                    route.reset();
                }

                meshObj.moveBy(direction.mul(speed));

                // meshObj.setPosition(pathObj.points[0]);
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
        const currentStopPos = pathObj.points[route.currentStop];

        return meshPos.distanceTo(currentStopPos) < 1;
    }

    initRoutes() {
        this.gameFacade.gameStore.getRouteObjects().forEach(route => {
            const meshObj = route.getMeshObject();
            const pathObj = route.getPathObject();
            meshObj.setPosition(pathObj.points[0]);
        });
    }
}