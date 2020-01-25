import { AnimationName, GameObject } from '../../../world_generator/services/GameObject';

export class CharacterMovement {
    private animationTimeouts: Map<GameObject, number> = new Map();

    forward(character: GameObject) {
        character.moveBy(character.getDirection().mul(-1 * character.speed, -1 * character.speed));
        character.activeAnimation = AnimationName.Walk;
        this.clearAnimationTimeout(character);
        this.setAnimationTimeout(character);
    }

    backward(character: GameObject) {
        character.moveBy(character.getDirection().mul(character.speed, character.speed));
        character.activeAnimation = AnimationName.Walk;
    }

    left(character: GameObject) {
        character.rotateBy(-0.02);
    }

    right(character: GameObject) {
        character.rotateBy(0.02);
    }

    private clearAnimationTimeout(character: GameObject) {
        if (this.animationTimeouts.has(character)) {
            clearTimeout(this.animationTimeouts.get(character));
            this.animationTimeouts.delete(character);
        }
    }

    private setAnimationTimeout(character: GameObject) {
        this.animationTimeouts.set(character, <any> setTimeout(() => character.activeAnimation = AnimationName.None, 300));
    }
}