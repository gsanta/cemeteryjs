import { GameFacade } from "../../GameFacade";
import { MeshObject } from "../../models/objects/MeshObject";
import { GameEvent } from "../GameEventManager";
import { LifeCycleEvent } from "../triggers/ILifeCycleTrigger";
import { IEventListener } from "./IEventListener";

export class AnimationPlayer implements IEventListener {
    events: GameEvent[];
    private gameFacade: GameFacade;
    private playingAnimations: Map<MeshObject, string> = new Map();

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
        this.updateAnimations = this.updateAnimations.bind(this);

        this.events = [
            new GameEvent({lifeCycleEvent: LifeCycleEvent.AfterRender}, this.updateAnimations)
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
        this.gameFacade.gameStore.getMeshObjects()
        .filter(gameObject => gameObject.activeAnimation)
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
        const mesh = this.gameFacade.meshStore.getMesh(gameObject.meshName);

        if (mesh) {
            const range = mesh.skeleton.getAnimationRange(gameObject.activeAnimation);
            this.gameFacade.scene.beginAnimation(mesh.skeleton, range.from, range.to, true);
            this.playingAnimations.set(gameObject, gameObject.activeAnimation);
        }

    }
}
