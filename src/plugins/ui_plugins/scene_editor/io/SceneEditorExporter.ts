import { IPluginExporter, IPluginJson, ViewGroupJson } from "../../../../core/plugins/IPluginExporter";
import { Registry } from "../../../../core/Registry";
import { SceneEditorPlugin } from "../SceneEditorPlugin";


export class SceneEditorExporter implements IPluginExporter {
    private plugin: SceneEditorPlugin;
    private registry: Registry;

    constructor(plugin: SceneEditorPlugin, registry: Registry) {
        this.plugin = plugin;
        this.registry = registry;
    }

    export(): IPluginJson {
        const viewGroups: ViewGroupJson[] = this.plugin.viewTypes.map(viewType => {
            return {
                viewType,
                views: this.registry.stores.canvasStore.getViewsByType(viewType).map(view => view.toJson())
            }
        });

        return {
            pluginId: this.plugin.id,
            viewGroups: viewGroups
        }
    }
}