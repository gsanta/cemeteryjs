import { FormController } from "../../../core/controller/FormController";
import { UI_Panel, UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { LevelSettingsRenderer } from "./LevelSettingsPanel";
import { LevelController, LevelNameController, ClearLevelController } from "./LevelSettingsProps";

export const LevelSettingsPanelId = 'level-settings-panel'; 

export function registerLevelSettingsPanel(registry: Registry) {
    const panel = createPanel(registry);

    registry.ui.panel.registerPanel(panel);
}

function createPanel(registry: Registry): UI_Panel {

    const panel = new UI_Panel(registry, UI_Region.Sidepanel, LevelSettingsPanelId, 'Level Settings');
    panel.renderer = new LevelSettingsRenderer();

    const propControllers = [
        new LevelController(registry),
        new LevelNameController(registry),
        new ClearLevelController(registry)
    ];

    panel.controller = new FormController(undefined, registry, propControllers);

    return panel;
}