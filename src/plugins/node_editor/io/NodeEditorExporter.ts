import { ViewType } from "../../../core/stores/views/View";
import { Registry } from "../../../core/Registry";
import { IPluginExporter, IPluginJson } from '../../common/io/IPluginExporter';
import { NodeEditorPlugin } from "../NodeEditorPlugin";

export class NodeEditorExporter implements IPluginExporter {
    private plugin: NodeEditorPlugin;
    private registry: Registry;

    constructor(plugin: NodeEditorPlugin, registry: Registry) {
        this.plugin = plugin;
        this.registry = registry;
    }

    export(): IPluginJson {
        const nodeViews = this.registry.stores.nodeStore.getNodes();
        const connections = this.registry.stores.nodeStore.getConnections();

        return {
            pluginId: this.plugin.id,
            viewGroups: [
                {
                    viewType: ViewType.NodeView,
                    views: nodeViews.map(meshView => meshView.toJson())
                },
                {
                    viewType: ViewType.NodeConnectionView,
                    views: connections.map(pathView => pathView.toJson())
                }
            ]
        }
    }
}