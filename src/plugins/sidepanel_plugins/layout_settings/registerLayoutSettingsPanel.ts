import { FormController } from "../../../core/plugin/controller/FormController";
import { UI_Panel, UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { LayoutControl } from "./LayoutSettingsProps";
import { LayoutSettingsRenderer } from "./LayoutSettingsRenderer";

export const LayoutSettingsPanelId = 'layout-settings-panel';


export function registerLayoutSettingsPanel(registry: Registry) {
    const panel = createPanel(registry);

    registry.ui.panel.registerPanel(panel);
}

function createPanel(registry: Registry): UI_Panel {

    const panel = new UI_Panel(registry, UI_Region.Sidepanel, LayoutSettingsPanelId, 'Layout Settings');
    panel.renderer = new LayoutSettingsRenderer();

    const propControllers = [
        new LayoutControl()
    ];

    panel.controller = new FormController(this, registry, propControllers);

    return panel;
}