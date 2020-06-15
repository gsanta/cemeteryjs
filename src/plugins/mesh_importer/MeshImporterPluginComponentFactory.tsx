import { AbstractPluginComponentFactory } from "../common/AbstractPluginComponentFactory";
import { MeshImporterPlugin } from "./MeshImporterPlugin";

export class MeshImporterPluginComponentFactory extends AbstractPluginComponentFactory<MeshImporterPlugin> {
    renderSidePanelSettings() {
        return null;
    }
}