import { IEventListener } from "../listeners/IEventListener";
import { GameEvent } from "../GameEventManager";
import { GameFacade } from "../../GameFacade";
import { LifeCycleEvent } from "../triggers/ILifeCycleTrigger";
import { RouteObject } from "../../models/objects/RouteObject";

export class RouteWalker implements IEventListener {
    events: GameEvent[];
    private gameFacade: GameFacade;

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
        this.gameFacade.gameStore.getRouteObjects()
            .filter(route => route.isFinished === false)
            .forEach(route => {
                const meshObj = route.getMeshObject();
                const pathObj = route.getPathObject();

                const direction =  pathObj.points[route.currentStop].subtract(meshObj.getPosition()).normalize();

                this.isNextStopReached(route) && route.currentStop++;
                // route.currentStop === pathObj.points.length && (route.isFinished = true);

                if (route.currentStop === pathObj.points.length) {
                    route.reset();
                }

                meshObj.moveBy(direction.div(10));

                // meshObj.setPosition(pathObj.points[0]);
            });
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