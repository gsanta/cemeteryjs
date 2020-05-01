import { Registry } from "../../../editor/Registry";
import { ElementalAnimation } from "../../../editor/views/canvas/models/meta/AnimationConcept";
import { MeshObject } from "../../models/objects/MeshObject";

export class AnimationPlayer {
    private playingAnimations: Map<MeshObject, ElementalAnimation> = new Map();
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
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
        this.registry.stores.gameStore.getMeshObjects()
        .filter(gameObject => gameObject.activeElementalAnimation)
        .forEach(gameObject => {
            if (!this.playingAnimations.has(gameObject)) {
                this.startAnimation(gameObject);
            } 
        });
    }

    private stopAnimation(meshObject: MeshObject) {
        this.playingAnimations.delete(meshObject);
        this.registry.services.game.gameEngine.scene.stopAnimation(meshObject.getMesh().skeleton);
    }

    private startAnimation(meshObject: MeshObject) {
        if (meshObject.getMesh()) {
            const range = meshObject.getMesh().skeleton.getAnimationRange(meshObject.activeElementalAnimation.name);
            this.registry.services.game.gameEngine.scene.beginAnimation(meshObject.getMesh().skeleton, range.from, range.to, true);
            this.playingAnimations.set(meshObject, meshObject.activeElementalAnimation);
        }

    }
}
