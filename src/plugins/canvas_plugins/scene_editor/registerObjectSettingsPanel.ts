import { UI_Panel, UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { ObjectSettigsRenderer } from "./ObjectSettingsRenderer";

export const ObjectSettingsPanelId = 'object-settings-panel'; 

export function registerObjectSettingsPanel(registry: Registry) {
    const panel = createPanel(registry);

    registry.ui.panel.registerPanel(panel);
}

function createPanel(registry: Registry): UI_Panel {

    const panel = new UI_Panel(registry, UI_Region.Sidepanel, ObjectSettingsPanelId, 'Object Settings');
    panel.renderer = new ObjectSettigsRenderer(registry);

    return panel;
}