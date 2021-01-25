import { FormController } from "../../../../core/controller/FormController";
import { UI_Panel, UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { ExportFileController, ImportFileController, NewProjectController } from "./FileSettingsProps";
import { FileSettingsRenderer } from "./FileSettingsRenderer";

export const FileSettingsPanelId = 'file-settings-panel'; 

export function registerFileSettingsPanel(registry: Registry) {
    const panel = createPanel(registry);

    registry.ui.panel.registerPanel(panel);
}

function createPanel(registry: Registry): UI_Panel {

    const panel = new UI_Panel(registry, UI_Region.Sidepanel, FileSettingsPanelId, 'File Settings');
    panel.renderer = new FileSettingsRenderer();

    const propControllers = [
        new ExportFileController(registry),
        new ImportFileController(registry),
        new NewProjectController(registry)
    ];

    panel.controller = new FormController(undefined, registry, propControllers);

    return panel;
}