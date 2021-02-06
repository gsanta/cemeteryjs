import { UI_Panel, UI_Region } from "../../../../core/models/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { LayoutSettingsControllers } from "./LayoutSettingsControllers";
import { LayoutSettingsRenderer } from "./LayoutSettingsRenderer";

export const LayoutSettingsPanelId = 'layout-settings-panel';

export class LayoutSettingsModule extends UI_Panel {

    constructor(registry: Registry) {
        super(registry, UI_Region.Sidepanel, LayoutSettingsPanelId, 'Layout Settings');
        
        this.renderer = new LayoutSettingsRenderer(this, new LayoutSettingsControllers(registry));
    }
}