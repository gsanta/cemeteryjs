import { Vector3, Mesh } from 'babylonjs';
import { GameFacade } from '../../GameFacade';
import { GameObject, AnimationName } from '../../../world_generator/services/GameObject';

enum MovementType {
    WalkForward = 'WalkForward',
    WalkBackward = 'WalkBackward',
    TurnLeft = 'TurnLeft',
    TurnRight = 'TurnRight',
}

type MoveFunc = (gameObject: GameObject, mesh: Mesh) => void;

export class PlayerMovement {
    private gameFacade: GameFacade;

    private animationTypeToActionMap: Map<AnimationName, MoveFunc>;
    private activeAnimations: Map<AnimationName, NodeJS.Timeout> = new Map();

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;

        this.animationTypeToActionMap = new Map(
            [
                [
                    AnimationType.Walk,
                    (player: GameObject, mesh: Mesh) => {
                        this.gameFacade.scene.beginAnimation(mesh, 0, 24, true);
                    }
                ]
            ]
        )
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


    private playAnimation(animationType: AnimationName) {
        const player = this.gameFacade.gameObjectStore.getPlayer();
        const mesh = this.gameFacade.meshStore.getMesh(player.meshName);

        if (!this.activeAnimations.has(animationType)) {
            this.gameFacade.scene.beginAnimation(mesh, 0, 24, true);
        } else {
            clearTimeout(this.activeAnimations.get(animationType));
        }
            
        this.activeAnimations.set(
            animationType,
            <any> setTimeout(
                () => {
                    this.gameFacade.scene.stopAnimation(mesh);
                    this.activeAnimations.delete(animationType);
                },
                100
            )
        )
    }
}