import { UI_Layout } from '../../core/gui_builder/elements/UI_Layout';
import { UI_Plugin, UI_Region } from '../../core/UI_Plugin';

export class AssetManagerPlugin extends UI_Plugin {
    static id = 'asset-manager-plugin';
    region = UI_Region.SidepanelWidget;

    getStore() {
        return null;
    }

    getId(): string {
        return AssetManagerPlugin.id;
    }

    renderInto(layout: UI_Layout): void {
        let row = layout.row(null);

        // const manageAssestButton = row.button();

        // const grid = row.grid(LevelSettingsProps.Level);
        // grid.label = 'Level'

        // row = layout.row();
        // const textField = row.textField(LevelSettingsProps.LevelName);
        // textField.label = 'Name';

        // row = layout.row();
        // row.align = 'center';
        // const clearLevelButton = row.button(LevelSettingsProps.ClearLevel);
        // clearLevelButton.label = 'Clear level';
    }
}