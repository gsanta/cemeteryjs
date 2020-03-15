import { AbstractSettings } from './AbstractSettings';
import { UpdateTask } from '../../../services/UpdateServices';
import { MeshConcept } from '../models/concepts/MeshConcept';
import { ServiceLocator } from '../../../services/ServiceLocator';
import { Stores } from '../../../stores/Stores';

export enum LevelFormPropType {
    Level = 'Level',
    LevelName = 'LevelName',
    ClearLevel = 'ClearLevel'
}

export class LevelSettings extends AbstractSettings<LevelFormPropType> {
    static type = 'level-settings';
    getType() { return LevelSettings.type; }
    meshConcept: MeshConcept;

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
                this.getServices().levelService().changeLevel(val);
                break;
            case LevelFormPropType.LevelName:
                this.getStores().levelStore.currentLevel.name = val;
                this.getServices().updateService().runImmediately(UpdateTask.RepaintSettings);
                break;
            case LevelFormPropType.ClearLevel:
                this.getServices().levelService().removeCurrentLevel()
                .then(() => this.getServices().updateService().runImmediately(UpdateTask.All, UpdateTask.SaveData))
                .catch(() => this.getServices().updateService().runImmediately(UpdateTask.All, UpdateTask.SaveData))
                break;
        }
    }
}