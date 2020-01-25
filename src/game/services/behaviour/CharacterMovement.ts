import { AnimationName, GameObject } from '../../../world_generator/services/GameObject';
import { GameFacade } from '../../GameFacade';

export class CharacterMovement {
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    forward(character: GameObject) {
        character.moveBy(character.getDirection().mul(-1 * character.speed, -1 * character.speed));
        character.activeAnimation = AnimationName.Walk;
    }

    backward(character: GameObject) {
        character.moveBy(character.getDirection().mul(character.speed, character.speed));
        character.activeAnimation = AnimationName.Walk;
    }

    left(character: GameObject) {
        character.rotateBy(0.02);
    }

    right(character: GameObject) {
        character.rotateBy(-0.02);
    }
}