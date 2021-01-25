import { IRenderer } from "../../../../core/plugin/IRenderer";
import { UI_Layout } from "../../../../core/ui_components/elements/UI_Layout";
import { FileSettingsProps } from "./FileSettingsProps";

export class FileSettingsRenderer implements IRenderer<UI_Layout> {
    renderInto(layout: UI_Layout): void {
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
    }
}