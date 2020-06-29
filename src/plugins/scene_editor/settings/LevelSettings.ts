import { AbstractSettings } from './AbstractSettings';
import { RenderTask } from '../../../core/services/RenderServices';
import { MeshView } from '../../../core/models/views/MeshView';
import { Services } from '../../../core/services/ServiceLocator';
import { Stores } from '../../../core/stores/Stores';
import { Registry } from '../../../core/Registry';

export enum LevelFormPropType {
    Level = 'Level',
    LevelName = 'LevelName',
    ClearLevel = 'ClearLevel'
}

export class LevelSettings extends AbstractSettings<LevelFormPropType> {
    static settingsName = 'level-settings';
    getName() { return LevelSettings.settingsName; }
    meshConcept: MeshView;

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
                this.registry.services.render.runImmediately(RenderTask.RenderSidebar);
                break;
            case LevelFormPropType.ClearLevel:
                this.registry.services.level.clearLevel()
                .finally(() => {
                    this.registry.services.history.createSnapshot();
                    this.registry.services.render.runImmediately(RenderTask.RenderFull)
                });
                break;
        }
    }
}