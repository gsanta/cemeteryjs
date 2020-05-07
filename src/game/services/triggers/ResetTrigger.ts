

import { ILifeCycleTrigger, LifeCycleEvent } from './ILifeCycleTrigger';
import { ServiceLocator } from '../../../core/services/ServiceLocator';
import { Registry } from '../../../editor/Registry';

export class ResetTrigger implements ILifeCycleTrigger {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    activate(trigger: (event: LifeCycleEvent) => void) {
        this.registry.services.game.gameEngine.scene.registerAfterRender(() => {
            trigger(LifeCycleEvent.Reset);
        });
    }
}