import { AbstractSidepanelPlugin } from '../../../core/plugin/AbstractSidepanelPlugin';
import { UI_Region } from '../../../core/plugin/UI_Panel';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { FileSettingsProps } from './FileSettingsProps';

export const FileSettingsPluginId = 'file-settings-plugin'; 
export class FileSettingsPlugin extends AbstractSidepanelPlugin {
    id = FileSettingsPluginId;
    displayName = 'File Settings';
    region = UI_Region.Sidepanel;

    renderInto(layout: UI_Layout): UI_Layout {
        let row = layout.row({ key: FileSettingsProps.Export });

        const exportButton = row.button(FileSettingsProps.Export);
        exportButton.label = 'Export File';
        exportButton.icon = 'export-icon';
        exportButton.width = '200px';

        row = layout.row({ key: FileSettingsProps.Import });
        const importButton = row.fileUpload(FileSettingsProps.Import);
        importButton.label = 'Import File';
        importButton.icon = 'import-icon';
        importButton.width = '200px';

        row = layout.row({ key: FileSettingsProps.NewProject });
        const newProjectButton = row.button(FileSettingsProps.NewProject);
        newProjectButton.label = 'New Project';
        newProjectButton.icon = 'blank-icon';
        newProjectButton.width = '200px';

        return layout;
    }
}

