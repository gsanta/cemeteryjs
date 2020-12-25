import { IRenderer } from "../../../core/plugin/IRenderer";
import { Registry } from "../../../core/Registry";
import { UI_Layout } from "../../../core/ui_components/elements/UI_Layout";
import { FileSettingsControllers } from "./FileSettingsControllers";

export class FileSettingsRenderer implements IRenderer<UI_Layout> {
    private controller: FileSettingsControllers;

    constructor(registry: Registry) {
        this.controller = new FileSettingsControllers(registry);
    }

    renderInto(layout: UI_Layout): void {
        let row = layout.row({ key: 'export-row' });

        const exportButton = row.button('export');
        exportButton.paramController = this.controller.export;
        exportButton.label = 'Export File';
        exportButton.icon = 'export-icon';
        exportButton.width = '200px';

        row = layout.row({ key: 'import-row' });
        const importButton = row.fileUpload('import');
        importButton.paramController = this.controller.import;
        importButton.label = 'Import File';
        importButton.icon = 'import-icon';
        importButton.width = '200px';

        row = layout.row({ key: 'new-project-row' });
        const newProjectButton = row.button('new-project');
        newProjectButton.paramController = this.controller.newProject;
        newProjectButton.label = 'New Project';
        newProjectButton.icon = 'blank-icon';
        newProjectButton.width = '200px';
    }
}