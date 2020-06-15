import { AbstractPluginComponentFactory } from "../common/AbstractPluginComponentFactory";
import { CodeEditorPlugin } from "./CodeEditorPlugin";

export class CodeEditorPluginComponentFactory extends AbstractPluginComponentFactory<CodeEditorPlugin> {
    renderSidePanelSettings() {
        return null;
    }
}