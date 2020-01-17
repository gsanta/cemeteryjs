import { GameFacade } from "../../GameFacade";
import { IEventListener } from "./IEventListener";
import { GameEvent } from "../GameEventManager";
import { GameObject, AnimationName } from "../../../world_generator/services/GameObject";

export class AnimationPlayer implements IEventListener {
    events: GameEvent[];
    private gameFacade: GameFacade;
    private playingAnimations: Map<GameObject, AnimationName> = new Map();
    private animationTimeouts: Map<GameObject, number> = new Map();

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
        this.updateAnimations = this.updateAnimations.bind(this);

        this.events = [
            new GameEvent({isAfterRender: true}, this.updateAnimations)
        ]
    }

    private updateAnimations() {
        this.gameFacade.gameObjectStore
        .gameObjects.forEach(gameObject => {
            if (this.isAnimationChanged(gameObject)) {
                this.stopActiveAnimation(gameObject);
            }

            if (this.hasActiveAnimation(gameObject)) {
                this.extendAnimationTimeout(gameObject);
            } else {
                this.startAnimation(gameObject);
            }
        });
    }

    private hasActiveAnimation(gameObject: GameObject) {
        return this.playingAnimations.has(gameObject);
    }

    private isAnimationChanged(gameObject: GameObject) {
        const currentAnimation = this.playingAnimations.get(gameObject) || AnimationName.None;
        
        return currentAnimation !== gameObject.activeAnimation;
    }

    private stopActiveAnimation(gameObject: GameObject) {
        const mesh = this.gameFacade.meshStore.getMesh(gameObject.meshName);

        if (this.animationTimeouts.has(gameObject)) {
            clearTimeout(this.animationTimeouts.get(gameObject));
            this.playingAnimations.delete(gameObject);
            this.animationTimeouts.delete(gameObject);
            this.gameFacade.scene.stopAnimation(mesh);
        }
    }

    private startAnimation(gameObject: GameObject) {
        if (gameObject.activeAnimation === AnimationName.None) { return; }

        const mesh = this.gameFacade.meshStore.getMesh(gameObject.meshName);

        this.gameFacade.scene.beginAnimation(mesh, 0, 24, true);
            
        this.animationTimeouts.set(gameObject, <any> setTimeout(() => this.stopActiveAnimation(gameObject), 100));
    }

    private extendAnimationTimeout(gameObject: GameObject) {
        if (this.animationTimeouts.has(gameObject)) {
            clearTimeout(this.animationTimeouts.get(gameObject));
            this.animationTimeouts.set(gameObject, <any> setTimeout(() => this.stopActiveAnimation(gameObject), 100));
        }
    }
}