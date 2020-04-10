import { MeshObject } from "./models/objects/MeshObject";
import { GameFacade } from "./GameFacade";
import { AnimationState } from "../editor/views/canvas/models/concepts/MeshConcept";
import { Stores } from "../editor/stores/Stores";

export class MeshObjectUpdater {
    private getStores: () => Stores;

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
    }

    updateAnimationState(state: AnimationState, meshObjectName: string) {
        switch(state) {
            case AnimationState.Paused:
                this.getStores().gameStore.getByName<MeshObject>(meshObjectName).getRoute().isPaused = true;
                break;
            case AnimationState.Playing:
                this.getStores().gameStore.getByName<MeshObject>(meshObjectName).getRoute().isPaused = false;
                break;
            case AnimationState.Stopped:
                this.getStores().gameStore.getByName<MeshObject>(meshObjectName).getRoute().reset();
                this.getStores().gameStore.getByName<MeshObject>(meshObjectName).getRoute().isPaused = true;
                break;
        }
    }
}