import { ServiceLocator } from '../../../core/services/ServiceLocator';
import { Registry } from '../../../core/Registry';

export class AfterRenderTrigger {

    constructor(registry: Registry) {
        registry.services.game.gameEngine.scene.registerAfterRender(() => {
            registry.services.game.gameEventManager.triggerAfterRenderEvent();
        });
    }
}