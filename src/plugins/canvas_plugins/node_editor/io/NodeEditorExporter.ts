import { Registry } from "../../../../core/Registry";
import { AppJson } from "../../../../core/services/export/ExportService";
import { IDataExporter } from "../../../../core/services/export/IDataExporter";
import { NodeEditorPlugin } from "../../../canvas_plugins/node_editor/NodeEditorPlugin";

export class NodeEditorExporter implements IDataExporter {
    private plugin: NodeEditorPlugin;
    private registry: Registry;

    constructor(plugin: NodeEditorPlugin, registry: Registry) {
        this.plugin = plugin;
        this.registry = registry;
    }

    export(json: Partial<AppJson>): void {
        json[this.plugin.id] = {
            views: this.registry.stores.viewStore.getAllViews().map(view => view.toJson())
        }
    }
}