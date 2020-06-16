import { AbstractPluginComponentFactory } from "../common/AbstractPluginComponentFactory";
import { CodeEditorPlugin } from "./CodeEditorPlugin";

export class CodeEditorPluginComponentFactory extends AbstractPluginComponentFactory<CodeEditorPlugin> {
    renderSidePanelSettingsWhenPluginActive() {
        return null;
    }
}