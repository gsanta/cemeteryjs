import { UI_Plugin, UI_Region } from "../../core/UI_Plugin";
import { Registry } from "../../core/Registry";
import { UI_Layout } from "../../core/gui_builder/elements/UI_Layout";
import { LevelSettingsController, LevelSettingsProps, LevelSettingsControllerId } from './LevelSettingsController';

export const LevelSettingsPluginId = 'level-settings-plugin';

export class LevelSettingsPlugin extends UI_Plugin {
    id = LevelSettingsPluginId;
    displayName = 'Level Settings';
    region = UI_Region.SidepanelWidget;

    constructor(registry: Registry) {
        super(registry);

        this.controllers.set(LevelSettingsControllerId, new LevelSettingsController(this, this.registry));
    }

    renderInto(layout: UI_Layout): void {
        layout.controllerId = LevelSettingsControllerId;
        let row = layout.row(null);

        const grid = row.grid({prop: LevelSettingsProps.Level});
        grid.label = 'Level'

        row = layout.row(null);
        const textField = row.textField(LevelSettingsProps.LevelName);
        textField.label = 'Name';

        row = layout.row(null);
        row.align = 'center';
        const clearLevelButton = row.button(LevelSettingsProps.ClearLevel);
        clearLevelButton.label = 'Clear level';
    }
}