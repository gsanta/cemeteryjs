import { AbstractSettings } from './AbstractSettings';
import { UpdateTask } from '../../../services/UpdateServices';
import { MeshConcept } from '../models/concepts/MeshConcept';
import { ServiceLocator } from '../../../services/ServiceLocator';
import { Stores } from '../../../stores/Stores';

export enum AnimationSettingsProps {
    Level = 'Level',
    LevelName = 'LevelName',
    ClearLevel = 'ClearLevel'
}

export class AnimationSettings extends AbstractSettings<AnimationSettingsProps> {
    static type = 'animation-settings';
    getType() { return AnimationSettings.type; }
    meshConcept: MeshConcept;

    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        super();
        this.getServices = getServices;
        this.getStores = getStores;
    }

    protected getProp(prop: AnimationSettingsProps) {
        switch (prop) {
            case AnimationSettingsProps.Level:
                return this.getStores().levelStore.currentLevel.index;
            case AnimationSettingsProps.LevelName:
                return this.getStores().levelStore.currentLevel.name;
        }
    }

    protected setProp(val: any, prop: AnimationSettingsProps) {
        switch (prop) {
            case AnimationSettingsProps.Level:
                this.getServices().levelService().changeLevel(val);
                break;
            case AnimationSettingsProps.LevelName:
                this.getStores().levelStore.currentLevel.name = val;
                this.getServices().updateService().runImmediately(UpdateTask.RepaintSettings);
                break;
            case AnimationSettingsProps.ClearLevel:
                this.getServices().levelService().removeCurrentLevel()
                .then(() => this.getServices().updateService().runImmediately(UpdateTask.All, UpdateTask.SaveData))
                .catch(() => this.getServices().updateService().runImmediately(UpdateTask.All, UpdateTask.SaveData))
                break;
        }
    }
}