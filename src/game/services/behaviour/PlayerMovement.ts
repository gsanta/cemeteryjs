import { Vector3 } from 'babylonjs';
import { GameFacade } from '../../GameFacade';

export class PlayerMovement {
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    forward() {
        
        const player = this.gameFacade.gameObjectStore.getPlayer();
        const mesh = this.gameFacade.meshStore.getMesh(player.meshName);
        mesh.moveWithCollisions(player.frontVector.multiplyByFloats(-1 * player.speed, -1 * player.speed, -1 * player.speed));
    }

    backward() {
        const player = this.gameFacade.gameObjectStore.getPlayer();
        const mesh = this.gameFacade.meshStore.getMesh(player.meshName);
        mesh.moveWithCollisions(player.frontVector.multiplyByFloats(player.speed, player.speed, player.speed));
    }

    left() {
        const player = this.gameFacade.gameObjectStore.getPlayer();
        const mesh = this.gameFacade.meshStore.getMesh(player.meshName);

        mesh.rotation.y += 0.2;
        const alpha = mesh.rotation.y;

        player.frontVector = new Vector3(Math.sin(alpha), 0, Math.cos(alpha));
    }

    right() {
        const player = this.gameFacade.gameObjectStore.getPlayer();
        const mesh = this.gameFacade.meshStore.getMesh(player.meshName);

        mesh.rotation.y -= 0.2;
        const alpha = mesh.rotation.y;

        player.frontVector = new Vector3(Math.sin(alpha), 0, Math.cos(alpha));
    }
}