import { IPluginExporter, IPluginJson, ViewGroupJson } from "../../../../core/plugins/IPluginExporter";
import { Registry } from "../../../../core/Registry";
import { AppJson } from "../../../../core/services/export/ExportService";
import { IDataExporter } from "../../../../core/services/export/IDataExporter";
import { SceneEditorPlugin } from "../SceneEditorPlugin";


export class SceneEditorExporter implements IDataExporter {
    private plugin: SceneEditorPlugin;
    private registry: Registry;

    constructor(plugin: SceneEditorPlugin, registry: Registry) {
        this.plugin = plugin;
        this.registry = registry;
    }

    export(json: Partial<AppJson>): void {
        json[this.plugin.id] = {
            views: this.registry.stores.canvasStore.getAllViews().map(view => view.toJson())
        }
    }
}