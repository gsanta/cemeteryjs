import { EventDispatcher } from '../../../common/EventDispatcher';
import { CanvasWindow } from '../CanvasWindow';
import { AbstractForm } from './AbstractForm';
import { UpdateTask } from '../../../common/services/UpdateServices';
import { MeshView } from '../models/views/MeshView';
import { ServiceLocator } from '../../../ServiceLocator';

export enum LevelFormPropType {
    Level = 'Level',
    LevelName = 'LevelName',
    ClearLevel = 'ClearLevel'
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
            case LevelFormPropType.LevelName:
                return this.controller.stores.levelStore.currentLevel.name;
        }
    }

    protected setProp(val: any, prop: LevelFormPropType) {
        switch (prop) {
            case LevelFormPropType.Level:
                this.services.levelService().changeLevel(val)
                    .then(() => this.controller.updateService.runImmediately(UpdateTask.All))
                    .catch(() => this.controller.updateService.runImmediately(UpdateTask.All))

                break;
            case LevelFormPropType.LevelName:
                this.controller.stores.levelStore.currentLevel.name = val;
                this.controller.updateService.runImmediately(UpdateTask.RepaintSettings);
                break;
            case LevelFormPropType.ClearLevel:
                this.services.levelService().removeLevel()
                .then(() => this.controller.updateService.runImmediately(UpdateTask.All))
                .catch(() => this.controller.updateService.runImmediately(UpdateTask.All))
                break;
        }
    }
}