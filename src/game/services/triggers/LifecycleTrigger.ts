

import { GameFacade } from '../../GameFacade';

export class LifecycleTrigger {
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    activate(trigger: (isAfterRender: boolean) => void) {
        this.gameFacade.scene.registerAfterRender(() => {
            trigger(true);
        });
    }
}