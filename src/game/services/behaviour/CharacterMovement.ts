import { MeshObject } from '../../models/objects/MeshObject';
import { AnimationName } from '../../../editor/views/canvas/models/concepts/MeshConcept';

export class CharacterMovement {
    private animationTimeouts: Map<MeshObject, number> = new Map();

    forward(character: MeshObject) {
        character.moveBy(character.getDirection().mul(-1 * character.speed, -1 * character.speed));
        character.activeAnimation = AnimationName.Walk;
        // this.clearAnimationTimeout(character);
        // this.setAnimationTimeout(character);
    }

    backward(character: MeshObject) {
        character.moveBy(character.getDirection().mul(character.speed, character.speed));
        character.activeAnimation = AnimationName.Walk;
    }

    left(character: MeshObject) {
        character.rotateBy(-0.02);
    }

    right(character: MeshObject) {
        character.rotateBy(0.02);
    }

    private clearAnimationTimeout(character: MeshObject) {
        if (this.animationTimeouts.has(character)) {
            clearTimeout(this.animationTimeouts.get(character));
            this.animationTimeouts.delete(character);
        }
    }

    private setAnimationTimeout(character: MeshObject) {
        this.animationTimeouts.set(character, <any> setTimeout(() => character.activeAnimation = AnimationName.None, 300));
    }
}