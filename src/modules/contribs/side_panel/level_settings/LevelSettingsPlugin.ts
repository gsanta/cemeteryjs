import { UI_Panel, UI_Region } from '../../../../core/models/UI_Panel';
import { UI_Layout } from '../../../../core/ui_components/elements/UI_Layout';
import { LevelSettingsProps } from './LevelSettingsProps';

export const LevelSettingsPluginId = 'level-settings-plugin';

export class LevelSettingsPlugin extends UI_Panel {
    id = LevelSettingsPluginId;
    displayName = 'Level Settings';
    region = UI_Region.Sidepanel;

    renderInto(layout: UI_Layout): void {
        let row = layout.row({ key: LevelSettingsProps.Level });

        const grid = row.grid({key: LevelSettingsProps.Level});
        grid.label = 'Level'

        row = layout.row({ key: LevelSettingsProps.LevelName });
        const textField = row.textField({key: LevelSettingsProps.LevelName});
        textField.label = 'Name';

        row = layout.row({ key: LevelSettingsProps.ClearLevel });
        row.vAlign = 'center';
        const clearLevelButton = row.button(LevelSettingsProps.ClearLevel);
        clearLevelButton.label = 'Clear level';
    }
}