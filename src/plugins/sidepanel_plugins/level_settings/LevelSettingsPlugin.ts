import { UI_Plugin, UI_Region } from '../../../core/plugin/UI_Plugin';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { LevelSettingsProps } from './LevelSettingsProps';

export const LevelSettingsPluginId = 'level-settings-plugin';

export class LevelSettingsPlugin extends UI_Plugin {
    id = LevelSettingsPluginId;
    displayName = 'Level Settings';
    region = UI_Region.Sidepanel;

    renderInto(layout: UI_Layout): void {
        let row = layout.row({ key: LevelSettingsProps.Level });

        const grid = row.grid({prop: LevelSettingsProps.Level});
        grid.label = 'Level'

        row = layout.row({ key: LevelSettingsProps.LevelName });
        const textField = row.textField({prop: LevelSettingsProps.LevelName});
        textField.label = 'Name';

        row = layout.row({ key: LevelSettingsProps.ClearLevel });
        row.vAlign = 'center';
        const clearLevelButton = row.button(LevelSettingsProps.ClearLevel);
        clearLevelButton.label = 'Clear level';
    }
}