import { EventDispatcher } from '../../../common/EventDispatcher';
import { CanvasWindow } from '../CanvasWindow';
import { AbstractForm } from './AbstractForm';
import { UpdateTask } from '../../../common/services/UpdateServices';
import { MeshView } from '../models/views/MeshView';
import { ServiceLocator } from '../../../ServiceLocator';
import { Stores } from '../../../Stores';

export enum LevelFormPropType {
    Level = 'Level',
    LevelName = 'LevelName',
    ClearLevel = 'ClearLevel'
}

export class LevelForm extends AbstractForm<LevelFormPropType> {
    gameObject: MeshView;

    private controller: CanvasWindow;
    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(controller: CanvasWindow, getServices: () => ServiceLocator, getStores: () => Stores) {
        super();
        this.controller = controller;
        this.getServices = getServices;
        this.getStores = getStores;
    }

    protected getProp(prop: LevelFormPropType) {
        switch (prop) {
            case LevelFormPropType.Level:
                return this.getStores().levelStore.currentLevel.index;
            case LevelFormPropType.LevelName:
                return this.getStores().levelStore.currentLevel.name;
        }
    }

    protected setProp(val: any, prop: LevelFormPropType) {
        switch (prop) {
            case LevelFormPropType.Level:
                this.getServices().levelService().changeLevel(val)
                    .then(() => this.controller.updateService.runImmediately(UpdateTask.All))
                    .catch(() => this.controller.updateService.runImmediately(UpdateTask.All))

                break;
            case LevelFormPropType.LevelName:
                this.getStores().levelStore.currentLevel.name = val;
                this.controller.updateService.runImmediately(UpdateTask.RepaintSettings);
                break;
            case LevelFormPropType.ClearLevel:
                this.getServices().levelService().removeCurrentLevel()
                .then(() => this.controller.updateService.runImmediately(UpdateTask.All))
                .catch(() => this.controller.updateService.runImmediately(UpdateTask.All))
                break;
        }
    }
}