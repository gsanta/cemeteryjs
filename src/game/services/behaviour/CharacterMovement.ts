import { Vector3 } from 'babylonjs';
import { AnimationName, GameObject } from '../../../world_generator/services/GameObject';
import { GameFacade } from '../../GameFacade';

export class CharacterMovement {
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    forward(character: GameObject) {
        const mesh = this.gameFacade.meshStore.getMesh(character.meshName);
        mesh.moveWithCollisions(character.frontVector.multiplyByFloats(-1 * character.speed, -1 * character.speed, -1 * character.speed));
        character.activeAnimation = AnimationName.Walk;
    }

    backward(character: GameObject) {
        const mesh = this.gameFacade.meshStore.getMesh(character.meshName);
        mesh.moveWithCollisions(character.frontVector.multiplyByFloats(character.speed, character.speed, character.speed));
        character.activeAnimation = AnimationName.Walk;
    }

    left(character: GameObject) {
        const mesh = this.gameFacade.meshStore.getMesh(character.meshName);
        mesh.rotation.y += 0.02;
        const alpha = mesh.rotation.y;
        character.frontVector = new Vector3(Math.sin(alpha), 0, Math.cos(alpha));        
    }

    right(character: GameObject) {
        const mesh = this.gameFacade.meshStore.getMesh(character.meshName);
        mesh.rotation.y -= 0.02;
        const alpha = mesh.rotation.y;
        character.frontVector = new Vector3(Math.sin(alpha), 0, Math.cos(alpha));      
    }
}