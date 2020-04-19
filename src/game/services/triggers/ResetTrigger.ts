

import { ILifeCycleTrigger, LifeCycleEvent } from './ILifeCycleTrigger';
import { ServiceLocator } from '../../../editor/services/ServiceLocator';

export class ResetTrigger implements ILifeCycleTrigger {
    private getServices: () => ServiceLocator;

    constructor(getServices: () => ServiceLocator) {
        this.getServices = getServices;
    }

    activate(trigger: (event: LifeCycleEvent) => void) {
        this.getServices().game.gameEngine.scene.registerAfterRender(() => {
            trigger(LifeCycleEvent.Reset);
        });
    }
}