import { ServiceLocator } from '../../../editor/services/ServiceLocator';

export class AfterRenderTrigger {
    private getServices: () => ServiceLocator;

    constructor(getServices: () => ServiceLocator) {
        this.getServices = getServices;

        this.getServices().game.gameEngine.scene.registerAfterRender(() => {
            this.getServices().game.gameEventManager.triggerAfterRenderEvent();
        });
    }
}