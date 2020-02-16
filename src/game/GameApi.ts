import { GameFacade } from "./GameFacade";
import { MeshObject } from "./models/objects/MeshObject";


export class GameApi {
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    resetPath(meshObjectName: string) {
        this.gameFacade.gameStore.getByName<MeshObject>(meshObjectName).getRoute().reset();
    }

    resetAllMovements() {
        this.gameFacade.gameStore.getRouteObjects().forEach(route => route.reset());
    }

    pauseMovement(meshObjectName: string) {
        this.gameFacade.gameStore.getByName<MeshObject>(meshObjectName).getRoute().isPaused = true;
    }

    pauseAllMovements() {
        this.gameFacade.gameStore.getRouteObjects().forEach(route => route.isPaused = true);
    }

    playMovement(meshObjectName: string) {
        this.gameFacade.gameStore.getByName<MeshObject>(meshObjectName).getRoute().isPaused = false;
    }

    playAllMovements() {
        this.gameFacade.gameStore.getRouteObjects().forEach(route => route.isPaused = false);
    }
}