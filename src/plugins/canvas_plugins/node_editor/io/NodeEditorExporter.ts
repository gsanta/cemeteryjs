import { NodeConnectionViewType } from "../../../../core/models/views/NodeConnectionView";
import { NodeViewType } from "../../../../core/models/views/NodeView";
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
        const nodeViews = [
            this.registry.stores.viewStore.getViewsByType(NodeViewType).map(view => view.toJson()),
            this.registry.stores.viewStore.getViewsByType(NodeConnectionViewType).map(view => view.toJson()),
        ];
        
        json[this.plugin.id] = {
            views: nodeViews
        }
    }
}