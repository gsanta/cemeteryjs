import { FormController } from "../../../../core/controller/FormController";
import { UI_Panel, UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { LevelSettingsRenderer } from "./LevelSettingsPanel";
import { LevelController, LevelNameController, ClearLevelController } from "./LevelSettingsProps";

export const LevelSettingsPanelId = 'level-settings-panel';

export class LevelSettingsModule extends UI_Panel {

    constructor(registry: Registry) {
        super(registry, UI_Region.Sidepanel, LevelSettingsPanelId, 'Level Settings');
        
        this.renderer = new LevelSettingsRenderer();

        const propControllers = [
            new LevelController(registry),
            new LevelNameController(registry),
            new ClearLevelController(registry)
        ];
    
        this.controller = new FormController(undefined, registry, propControllers);
    }
}