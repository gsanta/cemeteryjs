import { ElementalAnimation } from "../../../editor/views/canvas/models/meta/AnimationConcept";
import { GameFacade } from "../../GameFacade";
import { MeshObject } from "../../models/objects/MeshObject";

export class AnimationPlayer {
    private gameFacade: GameFacade;
    private playingAnimations: Map<MeshObject, ElementalAnimation> = new Map();

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    updateAnimations() {
        this.stopChangedAnimations();
        this.startNewAnimations();
    }

    private stopChangedAnimations() {
        this.playingAnimations.forEach((animName, gameObject) => {
            if (animName !== gameObject.activeElementalAnimation) {
                this.stopAnimation(gameObject);
            }
        });
    }

    private startNewAnimations() {
        this.gameFacade.stores.gameStore.getMeshObjects()
        .filter(gameObject => gameObject.activeElementalAnimation)
        .forEach(gameObject => {
            if (!this.playingAnimations.has(gameObject)) {
                this.startAnimation(gameObject);
            } 
        });
    }

    private stopAnimation(meshObject: MeshObject) {
        this.playingAnimations.delete(meshObject);
        this.gameFacade.gameEngine.scene.stopAnimation(meshObject.getMesh().skeleton);
    }

    private startAnimation(meshObject: MeshObject) {
        if (meshObject.getMesh()) {
            const range = meshObject.getMesh().skeleton.getAnimationRange(meshObject.activeElementalAnimation.name);
            this.gameFacade.gameEngine.scene.beginAnimation(meshObject.getMesh().skeleton, range.from, range.to, true);
            this.playingAnimations.set(meshObject, meshObject.activeElementalAnimation);
        }

    }
}
