import { AbstractSettings } from './AbstractSettings';
import { UpdateTask } from '../../../core/services/UpdateServices';
import { MeshConcept } from '../../../core/models/concepts/MeshConcept';
import { ServiceLocator } from '../../../core/services/ServiceLocator';
import { Stores } from '../../../core/stores/Stores';
import { Registry } from '../../../core/Registry';

export enum LevelFormPropType {
    Level = 'Level',
    LevelName = 'LevelName',
    ClearLevel = 'ClearLevel'
}

export class LevelSettings extends AbstractSettings<LevelFormPropType> {
    static type = 'level-settings';
    getName() { return LevelSettings.type; }
    meshConcept: MeshConcept;

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    protected getProp(prop: LevelFormPropType) {
        switch (prop) {
            case LevelFormPropType.Level:
                return this.registry.stores.levelStore.currentLevel.index;
            case LevelFormPropType.LevelName:
                return this.registry.stores.levelStore.currentLevel.name;
        }
    }

    protected setProp(val: any, prop: LevelFormPropType) {
        switch (prop) {
            case LevelFormPropType.Level:
                this.registry.services.level.changeLevel(val);
                break;
            case LevelFormPropType.LevelName:
                this.registry.stores.levelStore.currentLevel.name = val;
                this.registry.services.update.runImmediately(UpdateTask.RepaintSettings);
                break;
            case LevelFormPropType.ClearLevel:
                this.registry.services.level.clearLevel()
                .then(() => this.registry.services.update.runImmediately(UpdateTask.All, UpdateTask.SaveData))
                .catch(() => this.registry.services.update.runImmediately(UpdateTask.All, UpdateTask.SaveData))
                break;
        }
    }
}