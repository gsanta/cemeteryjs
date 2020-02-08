import { IEventListener } from "../listeners/IEventListener";
import { GameEvent } from "../GameEventManager";
import { GameFacade } from "../../GameFacade";
import { MeshObject } from "../../models/objects/MeshObject";
import { PathObject } from "../../models/objects/PathObject";
import { LifeCycleEvent } from "../triggers/ILifeCycleTrigger";

export class RouteWalker implements IEventListener {
    events: GameEvent[];
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
        this.initRoutes();

        this.events = [
            new GameEvent({lifeCycleEvent: LifeCycleEvent.AfterRender}, this.updateRoutes),
            new GameEvent({lifeCycleEvent: LifeCycleEvent.Reset}, this.initRoutes)
        ]
    }

    private updateRoutes() {

    }

    private initRoutes() {
        this.gameFacade.gameStore.getRouteObjects().forEach(route => {
            const meshObj = this.gameFacade.gameStore.getByName<MeshObject>(route.meshObjectName);
            const pathObj = this.gameFacade.gameStore.getByName<PathObject>(route.pathObjectName);

            meshObj.setPosition(pathObj.points[0]);
        });
    }
}