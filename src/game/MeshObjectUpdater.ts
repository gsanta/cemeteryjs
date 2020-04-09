import { MeshObject } from "./models/objects/MeshObject";
import { GameFacade } from "./GameFacade";
import { AnimationState } from "../editor/views/canvas/models/concepts/MeshConcept";

export class MeshObjectUpdater {
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    updateAnimationState(state: AnimationState, meshObjectName: string) {
        switch(state) {
            case AnimationState.Paused:
                this.gameFacade.stores.gameStore.getByName<MeshObject>(meshObjectName).getRoute().isPaused = true;
                break;
            case AnimationState.Playing:
                this.gameFacade.stores.gameStore.getByName<MeshObject>(meshObjectName).getRoute().isPaused = false;
                break;
            case AnimationState.Stopped:
                this.gameFacade.stores.gameStore.getByName<MeshObject>(meshObjectName).getRoute().reset();
                this.gameFacade.stores.gameStore.getByName<MeshObject>(meshObjectName).getRoute().isPaused = true;
                break;
        }
    }
}