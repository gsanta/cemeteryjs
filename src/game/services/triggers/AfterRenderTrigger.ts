

import { GameFacade } from '../../GameFacade';

export class AfterRenderTrigger {
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;

        this.gameFacade.gameEngine.scene.registerAfterRender(() => {
            this.gameFacade.gameEventManager.triggerAfterRenderEvent();
        });
    }
}