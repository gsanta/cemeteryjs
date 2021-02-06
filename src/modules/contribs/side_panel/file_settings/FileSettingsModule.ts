import { FormController } from "../../../../core/controller/FormController";
import { UI_Panel, UI_Region } from "../../../../core/models/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { ExportFileController, ImportFileController, NewProjectController } from "./FileSettingsProps";
import { FileSettingsRenderer } from "./FileSettingsRenderer";

export const FileSettingsPanelId = 'file-settings-panel'; 

export class FileSettingsModule extends UI_Panel {

    constructor(registry: Registry) {
        super(registry, UI_Region.Sidepanel, FileSettingsPanelId, 'File Settings');
        
        this.renderer = new FileSettingsRenderer();

        const propControllers = [
            new ExportFileController(registry),
            new ImportFileController(registry),
            new NewProjectController(registry)
        ];
    
        this.controller = new FormController(undefined, registry, propControllers);
    }
}