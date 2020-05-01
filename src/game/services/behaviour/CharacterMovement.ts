import { MeshObject } from '../../models/objects/MeshObject';
import { AnimationCondition } from '../../../editor/views/canvas/models/meta/AnimationConcept';
import { GamepadEvent } from '../GameEventManager';
import { Registry } from '../../../editor/Registry';

export class CharacterMovement {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    action(gamepadEvent: GamepadEvent) {
        const player = this.registry.stores.gameStore.getPlayer();
        if (!player) { return; }

        switch(gamepadEvent) {
            case GamepadEvent.Forward:
                this.forward(player);
            break;
            case GamepadEvent.Backward:
                this.backward(player);
            break;
            case GamepadEvent.TurnLeft:
                this.left(player);
            break;
            case GamepadEvent.TurnRight:
                this.right(player);
            break;
        }
    }

    forward(character: MeshObject) {
        character.moveBy(character.getDirection().mul(-1 * character.speed, -1 * character.speed));
        // character.activeElementalAnimation = character.animation.getAnimationByCond(AnimationCondition.Move);
    }

    backward(character: MeshObject) {
        character.moveBy(character.getDirection().mul(character.speed, character.speed));
        // character.activeElementalAnimation = character.animation.getAnimationByCond(AnimationCondition.Move);
    }

    left(character: MeshObject) {
        character.rotateBy(-0.02);
    }

    right(character: MeshObject) {
        character.rotateBy(0.02);
    }
}