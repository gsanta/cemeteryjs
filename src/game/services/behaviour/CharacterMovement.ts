import { GamepadEvent } from '../GameEventManager';
import { Registry } from '../../../core/Registry';
import { MeshView } from '../../../core/models/views/MeshView';

export class CharacterMovement {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    action(gamepadEvents: GamepadEvent[]) {
        const player = this.registry.stores.gameStore.getPlayer();
        if (!player) { return; }

        gamepadEvents.forEach(gamepadEvent => {
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
        });
    }

    forward(character: MeshView) {
        character.moveForward(character.getDirection().mul(-1 * character.speed, -1 * character.speed));
        // character.activeElementalAnimation = character.animation.getAnimationByCond(AnimationCondition.Move);
    }

    backward(character: MeshView) {
        character.moveForward(character.getDirection().mul(character.speed, character.speed));
        // character.activeElementalAnimation = character.animation.getAnimationByCond(AnimationCondition.Move);
    }

    left(character: MeshView) {
        character.rotateBy(-0.02);
    }

    right(character: MeshView) {
        character.rotateBy(0.02);
    }
}