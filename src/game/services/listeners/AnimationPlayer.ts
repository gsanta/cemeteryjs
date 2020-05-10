import { Registry } from "../../../core/Registry";
import { ElementalAnimation } from "../../../core/models/meta/AnimationConcept";
import { MeshConcept } from "../../../core/models/concepts/MeshConcept";

export class AnimationPlayer {
    private playingAnimations: Map<MeshConcept, ElementalAnimation> = new Map();
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

    private stopAnimation(meshObject: MeshConcept) {
        this.playingAnimations.delete(meshObject);
        this.registry.services.game.gameEngine.scene.stopAnimation(meshObject.mesh.skeleton);
    }

    private startAnimation(meshObject: MeshConcept) {
        if (meshObject.mesh) {
            const range = meshObject.mesh.skeleton.getAnimationRange(meshObject.activeElementalAnimation.name);
            this.registry.services.game.gameEngine.scene.beginAnimation(meshObject.mesh.skeleton, range.from, range.to, true);
            this.playingAnimations.set(meshObject, meshObject.activeElementalAnimation);
        }

    }
}
