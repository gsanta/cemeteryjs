import { GameObject } from '../../../world_generator/services/GameObject';
import { GameFacade } from '../../GameFacade';


export class MeshAdapter {
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    move(gameObject: GameObject) {

    }
}