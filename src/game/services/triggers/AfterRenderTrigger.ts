import { ServiceLocator } from '../../../editor/services/ServiceLocator';
import { Registry } from '../../../editor/Registry';

export class AfterRenderTrigger {

    constructor(registry: Registry) {
        registry.services.game.gameEngine.scene.registerAfterRender(() => {
            registry.services.game.gameEventManager.triggerAfterRenderEvent();
        });
    }
}