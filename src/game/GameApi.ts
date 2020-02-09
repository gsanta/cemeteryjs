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
}