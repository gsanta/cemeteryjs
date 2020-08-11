import { ViewType } from '../../../core/stores/views/View';
import { Registry } from "../../../core/Registry";
import { IPluginExporter, IPluginJson } from '../../common/io/IPluginExporter';
import { SceneEditorPlugin } from "../SceneEditorPlugin";


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