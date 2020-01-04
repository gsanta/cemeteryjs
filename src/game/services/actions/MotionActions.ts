import { GameFacade } from '../../GameFacade';
import { Interaction } from '../input/InteractionManager';
import { KeyCode } from '../input/listeners/KeyboardListener';

export class MotionActions {
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    register() {
        const interactions: Interaction[] = [
            new Interaction({keyCode: KeyCode.w}, () => this.forward())
        ];

        interactions.forEach(ia => this.gameFacade.interactionManager.registerAction(ia));
    }

    private forward() {
        const player = this.gameFacade.gameObjectStore.getPlayer();
    }
}