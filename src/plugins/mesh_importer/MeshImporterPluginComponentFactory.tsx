import { AbstractPluginComponentFactory } from "../common/AbstractPluginComponentFactory";
import { MeshImporterPlugin } from "./MeshImporterPlugin";

export class MeshImporterPluginComponentFactory extends AbstractPluginComponentFactory<MeshImporterPlugin> {
    renderSidePanelSettingsWhenPluginActive() {
        return null;
    }

    renderSidePanelSettingsWhenPluginNotActive() {
        return null;
    }
}