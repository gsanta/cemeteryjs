import { LevelSettingsController, LevelSettingsProps, LevelSettingsControllerId } from './LevelSettingsController';
import { UI_Plugin, UI_Region } from '../../../core/plugins/UI_Plugin';
import { Registry } from '../../../core/Registry';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';

export const LevelSettingsPluginId = 'level-settings-plugin';

export class LevelSettingsPlugin extends UI_Plugin {
    id = LevelSettingsPluginId;
    displayName = 'Level Settings';
    region = UI_Region.Sidepanel;

    constructor(registry: Registry) {
        super(registry);

        this.controllers.set(LevelSettingsControllerId, new LevelSettingsController(this, this.registry));
    }

    renderInto(layout: UI_Layout): void {
        layout.controllerId = LevelSettingsControllerId;
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