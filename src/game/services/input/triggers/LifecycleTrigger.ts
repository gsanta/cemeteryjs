

import { GameFacade } from '../../../GameFacade';

export class LifecycleTrigger {
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    activate() {
        this.gameFacade.scene.registerAfterRender(() => {
            this.gameFacade.gameEventManager.trigger(true);
        });
    }
}