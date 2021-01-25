import { IRenderer } from "../../../../core/plugin/IRenderer";
import { UI_Layout } from "../../../../core/ui_components/elements/UI_Layout";
import { LevelSettingsProps } from "./LevelSettingsProps";

export class LevelSettingsRenderer implements IRenderer<UI_Layout> {
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