import { GameFacade } from '../../GameFacade';
import { Interaction } from '../input/InteractionManager';
import { KeyCode } from '../input/listeners/KeyboardListener';
import { Vector3, Axis, Space } from 'babylonjs';

export class MotionActions {
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    register() {
        const interactions: Interaction[] = [
            new Interaction({keyCode: KeyCode.w}, () => this.forward()),
            new Interaction({keyCode: KeyCode.s}, () => this.backward()),
            new Interaction({keyCode: KeyCode.a}, () => this.left()),
            new Interaction({keyCode: KeyCode.e}, () => this.right())
        ];

        interactions.forEach(ia => this.gameFacade.interactionManager.registerAction(ia));
    }

    private forward() {
        
        const player = this.gameFacade.gameObjectStore.getPlayer();
        const mesh = this.gameFacade.meshStore.getMesh(player.meshName);
        mesh.moveWithCollisions(player.frontVector.multiplyByFloats(-1 * player.speed, -1 * player.speed, -1 * player.speed));
    }

    private backward() {
        const player = this.gameFacade.gameObjectStore.getPlayer();
        const mesh = this.gameFacade.meshStore.getMesh(player.meshName);
        mesh.moveWithCollisions(player.frontVector.multiplyByFloats(player.speed, player.speed, player.speed));
    }

    private left() {
        const player = this.gameFacade.gameObjectStore.getPlayer();
        const mesh = this.gameFacade.meshStore.getMesh(player.meshName);

        mesh.rotation.y += 0.2;
        const alpha = mesh.rotation.y;

        player.frontVector = new Vector3(Math.sin(alpha), 0, Math.cos(alpha));
    }

    private right() {
        const player = this.gameFacade.gameObjectStore.getPlayer();
        const mesh = this.gameFacade.meshStore.getMesh(player.meshName);

        mesh.rotation.y -= 0.2;
        const alpha = mesh.rotation.y;

        player.frontVector = new Vector3(Math.sin(alpha), 0, Math.cos(alpha));
    }
}