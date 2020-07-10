import { UI_Layout } from "../../core/gui_builder/UI_Element";
import { UI_Plugin, UI_Region } from '../../core/UI_Plugin';
import { FileSettingsController, FileSettingsProps } from './FileSettingsController';
import { Registry } from '../../core/Registry';

export const FileSettingsPluginId = 'file-settings-plugin'; 
export class FileSettingsPlugin extends UI_Plugin {
    id = FileSettingsPluginId;
    region = UI_Region.SidepanelWidget;

    constructor(registry: Registry) {
        super(registry);

        this.controller = new FileSettingsController(registry)
    }

    render(): UI_Layout {
        const layout = new UI_Layout(this.controller);
        const row = layout.row();
        const button = row.button(FileSettingsProps.Export);
        button.label = 'Export';

        return layout;
    }
}