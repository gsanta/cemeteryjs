import { Vector3, Mesh } from 'babylonjs';
import { GameFacade } from '../../GameFacade';
import { GameObject } from '../../../world_generator/services/GameObject';

enum AnimationType {
    Walk = 'walk',
    Turn = 'turn'
} 

enum MovementType {
    WalkForward = 'WalkForward',
    WalkBackward = 'WalkBackward',
    TurnLeft = 'TurnLeft',
    TurnRight = 'TurnRight',
}

type MoveFunc = (gameObject: GameObject, mesh: Mesh) => void;

export class PlayerMovement {
    private gameFacade: GameFacade;

    private movementToActionMap: Map<MovementType, MoveFunc>;
    private animationTypeToActionMap: Map<AnimationType, MoveFunc>;
    private activeAnimations: Map<AnimationType, NodeJS.Timeout> = new Map();

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;

        this.movementToActionMap = new Map(
            [
                [
                    MovementType.WalkForward,
                    (player: GameObject, mesh: Mesh) => {
                        mesh.moveWithCollisions(player.frontVector.multiplyByFloats(-1 * player.speed, -1 * player.speed, -1 * player.speed));
                    }
                ],
                [
                    MovementType.WalkBackward,
                    (player: GameObject, mesh: Mesh) => {
                        mesh.moveWithCollisions(player.frontVector.multiplyByFloats(player.speed, player.speed, player.speed));
                    }
                ],
                [
                    MovementType.TurnLeft,
                    (player: GameObject, mesh: Mesh) => {
                        mesh.rotation.y += 0.02;
                        const alpha = mesh.rotation.y;
                
                        player.frontVector = new Vector3(Math.sin(alpha), 0, Math.cos(alpha));
                    }
                ],
                [
                    MovementType.TurnRight,
                    (player: GameObject, mesh: Mesh) => {
                        mesh.rotation.y -= 0.02;
                        const alpha = mesh.rotation.y;
                
                        player.frontVector = new Vector3(Math.sin(alpha), 0, Math.cos(alpha));
                    }
                ]
            ]
        );

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

    forward() {
        this.doAction(this.movementToActionMap.get(MovementType.WalkForward));
        this.playAnimation(AnimationType.Walk);
    }

    backward() {
        this.doAction(this.movementToActionMap.get(MovementType.WalkBackward));
        this.playAnimation(AnimationType.Walk);
    }

    left() {
        this.doAction(this.movementToActionMap.get(MovementType.TurnLeft));
    }

    right() {
        this.doAction(this.movementToActionMap.get(MovementType.TurnRight));
    }

    private doAction(moveFunc: MoveFunc) {
        const player = this.gameFacade.gameObjectStore.getPlayer();
        const mesh = this.gameFacade.meshStore.getMesh(player.meshName);

        moveFunc(player, mesh);
    }

    private playAnimation(animationType: AnimationType) {
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