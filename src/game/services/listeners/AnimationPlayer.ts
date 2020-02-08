import { GameFacade } from "../../GameFacade";
import { IEventListener } from "./IEventListener";
import { GameEvent } from "../GameEventManager";
import { MeshView, AnimationName } from "../../../common/views/MeshView";
import { MeshObject } from "../../models/objects/MeshObject";

export class AnimationPlayer implements IEventListener {
    events: GameEvent[];
    private gameFacade: GameFacade;
    private playingAnimations: Map<MeshObject, string> = new Map();

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
        this.updateAnimations = this.updateAnimations.bind(this);

        this.events = [
            new GameEvent({isAfterRender: true}, this.updateAnimations)
        ]
    }

    private updateAnimations() {
        this.stopChangedAnimations();
        this.startNewAnimations();
    }

    private stopChangedAnimations() {
        this.playingAnimations.forEach((animName, gameObject) => {
            if (animName !== gameObject.activeAnimation) {
                this.stopAnimation(gameObject);
            }
        });
    }

    private startNewAnimations() {
        this.gameFacade.gameObjectStore.getMeshObjects()
        .filter(gameObject => gameObject.activeAnimation !== AnimationName.None)
        .forEach(gameObject => {
            if (!this.playingAnimations.has(gameObject)) {
                this.startAnimation(gameObject);
            } 
        });
    }

    private stopAnimation(gameObject: MeshObject) {
        const mesh = this.gameFacade.meshStore.getMesh(gameObject.meshName);

        this.playingAnimations.delete(gameObject);
        this.gameFacade.scene.stopAnimation(mesh.skeleton);
    }

    private startAnimation(gameObject: MeshObject) {
        // const mesh = this.gameFacade.meshStore.getMesh(gameObject.meshName);

        // this.gameFacade.scene.beginAnimation(mesh.skeleton, 0, 24, true);
        // this.playingAnimations.set(gameObject, gameObject.activeAnimation);
    }
}