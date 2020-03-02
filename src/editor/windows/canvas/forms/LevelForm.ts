import { EventDispatcher } from '../../../common/EventDispatcher';
import { CanvasWindow } from '../CanvasWindow';
import { AbstractForm } from './AbstractForm';
import { UpdateTask } from '../../../common/services/UpdateServices';
import { MeshView } from '../models/views/MeshView';
import { ServiceLocator } from '../../../ServiceLocator';

export enum LevelFormPropType {
    Level = 'Level'
}

export class LevelForm extends AbstractForm<LevelFormPropType> {
    gameObject: MeshView;

    private controller: CanvasWindow;
    private services: ServiceLocator;

    constructor(controller: CanvasWindow, services: ServiceLocator) {
        super();
        this.controller = controller;
        this.services = services;
    }

    protected getProp(prop: LevelFormPropType) {
        switch (prop) {
            case LevelFormPropType.Level:
                return this.controller.stores.levelStore.currentLevel.index;
        }
    }

    protected setProp(val: any, prop: LevelFormPropType) {
        switch (prop) {
            case LevelFormPropType.Level:

                if (this.controller.stores.levelStore.hasLevel(val)) {
                    this.services.storageService().loadLevel(val);
                } else {
                    this.controller.stores.viewStore.clear();
                }

                this.controller.stores.levelStore.setCurrentLevel(val);
        }
        this.controller.updateService.runImmediately(UpdateTask.All);
    }
}