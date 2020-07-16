import { UI_Plugin, UI_Region } from '../../core/UI_Plugin';
import { FileSettingsController, FileSettingsProps } from './FileSettingsController';
import { Registry } from '../../core/Registry';
import { UI_Layout } from '../../core/gui_builder/elements/UI_Layout';

export const FileSettingsPluginId = 'file-settings-plugin'; 
export class FileSettingsPlugin extends UI_Plugin {
    id = FileSettingsPluginId;
    displayName = 'File Settings';
    region = UI_Region.SidepanelWidget;

    constructor(registry: Registry) {
        super(registry);

        this.controller = new FileSettingsController(registry)
    }

    renderInto(layout: UI_Layout): UI_Layout {
        let row = layout.row();

        const exportButton = row.button(FileSettingsProps.Export);
        exportButton.label = 'Export File';
        exportButton.icon = 'export-icon';
        exportButton.width = 'full-width';

        row = layout.row();
        const importButton = row.fileUpload(FileSettingsProps.Import);
        importButton.label = 'Import File';
        importButton.icon = 'import-icon';
        importButton.width = 'full-width';

        row = layout.row();
        const newProjectButton = row.button(FileSettingsProps.NewProject);
        newProjectButton.label = 'New Project';
        newProjectButton.icon = 'blank-icon';
        newProjectButton.width = 'full-width';

        return layout;
    }
}