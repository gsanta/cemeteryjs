import { MeshObject } from '../../models/objects/MeshObject';
import { AnimationCondition } from '../../../editor/views/canvas/models/meta/AnimationConcept';

export class CharacterMovement {
    private animationTimeouts: Map<MeshObject, number> = new Map();

    forward(character: MeshObject) {
        character.moveBy(character.getDirection().mul(-1 * character.speed, -1 * character.speed));
        character.activeElementalAnimation = character.animation.getAnimationByCond(AnimationCondition.Move);
        // this.clearAnimationTimeout(character);
        // this.setAnimationTimeout(character);
    }

    backward(character: MeshObject) {
        character.moveBy(character.getDirection().mul(character.speed, character.speed));
        character.activeElementalAnimation = character.animation.getAnimationByCond(AnimationCondition.Move);
    }

    left(character: MeshObject) {
        character.rotateBy(-0.02);
    }

    right(character: MeshObject) {
        character.rotateBy(0.02);
    }
}