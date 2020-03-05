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

    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        super();
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
                    .then(() => this.getServices().updateService().runImmediately(UpdateTask.All))
                    .catch(() => this.getServices().updateService().runImmediately(UpdateTask.All))

                break;
            case LevelFormPropType.LevelName:
                this.getStores().levelStore.currentLevel.name = val;
                this.getServices().updateService().runImmediately(UpdateTask.RepaintSettings);
                break;
            case LevelFormPropType.ClearLevel:
                this.getServices().levelService().removeCurrentLevel()
                .then(() => this.getServices().updateService().runImmediately(UpdateTask.All))
                .catch(() => this.getServices().updateService().runImmediately(UpdateTask.All))
                break;
        }
    }
}