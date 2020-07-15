import { UI_Plugin, UI_Region } from "../../core/UI_Plugin";
import { Registry } from "../../core/Registry";
import { UI_Layout } from "../../core/gui_builder/elements/UI_Layout";
import { LevelSettingsController, LevelSettingsProps } from "./LevelSettingsController";

export const LevelSettingsPluginId = 'level-settings-plugin';

export class LevelSettingsPlugin extends UI_Plugin {
    id = LevelSettingsPluginId;
    displayName = 'Level Settings';
    region = UI_Region.SidepanelWidget;

    constructor(registry: Registry) {
        super(registry);

        this.controller = new LevelSettingsController(this.registry);
    }

    renderInto(layout: UI_Layout): void {
        let row = layout.row();

        const grid = row.grid(LevelSettingsProps.Level);
        grid.label = 'Level'

        row = layout.row();
        const textField = row.textField(LevelSettingsProps.LevelName);
        textField.label = 'Name';

        row = layout.row();
        const exportButton = row.button(LevelSettingsProps.ClearLevel);
        exportButton.label = 'Clear level';
    }
}