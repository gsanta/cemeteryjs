import { IPluginExporter, IPluginJson } from "../../../common/io/IPluginExporter";
import { SceneEditorPlugin } from "../SceneEditorPlugin";
import { Registry } from "../../../../core/Registry";
import { ViewType } from "../../../../core/models/views/View";


export class SceneEditorExporter implements IPluginExporter {
    private plugin: SceneEditorPlugin;
    private registry: Registry;

    constructor(plugin: SceneEditorPlugin, registry: Registry) {
        this.plugin = plugin;
        this.registry = registry;
    }

    export(): IPluginJson {
        const meshViews = this.registry.stores.canvasStore.getMeshViews();
        const pathViews = this.registry.stores.canvasStore.getPathViews();

        return {
            pluginId: this.plugin.id,
            viewGroups: [
                {
                    viewType: ViewType.MeshView,
                    views: meshViews.map(meshView => meshView.toJson())
                },
                {
                    viewType: ViewType.PathView,
                    views: pathViews.map(pathView => pathView.toJson())
                }
            ]
        }
    }
}