import { UI_Plugin, UI_Region } from '../../core/UI_Plugin';
import { FileSettingsController, FileSettingsProps, FileSettingsControllerId } from './FileSettingsController';
import { Registry } from '../../core/Registry';
import { UI_Layout } from '../../core/gui_builder/elements/UI_Layout';
import { AbstractSidepanelPlugin } from '../../core/AbstractSidepanelPlugin';

export const FileSettingsPluginId = 'file-settings-plugin'; 
export class FileSettingsPlugin extends AbstractSidepanelPlugin {
    id = FileSettingsPluginId;
    displayName = 'File Settings';
    region = UI_Region.Sidepanel;
    isGlobalPlugin = true;

    constructor(registry: Registry) {
        super(registry);

        this.controllers.set(FileSettingsControllerId, new FileSettingsController(this, registry));
    }

    renderInto(layout: UI_Layout): UI_Layout {
        layout.controllerId = FileSettingsControllerId;
        let row = layout.row(null);

        const exportButton = row.button(FileSettingsProps.Export);
        exportButton.label = 'Export File';
        exportButton.icon = 'export-icon';
        exportButton.width = 'full-width';

        row = layout.row(null);
        const importButton = row.fileUpload(FileSettingsProps.Import);
        importButton.label = 'Import File';
        importButton.icon = 'import-icon';
        importButton.width = 'full-width';

        row = layout.row(null);
        const newProjectButton = row.button(FileSettingsProps.NewProject);
        newProjectButton.label = 'New Project';
        newProjectButton.icon = 'blank-icon';
        newProjectButton.width = 'full-width';

        return layout;
    }
}