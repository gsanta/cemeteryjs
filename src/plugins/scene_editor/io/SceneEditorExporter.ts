import { ConceptType } from '../../../core/models/views/View';
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
        const meshViews = this.registry.stores.canvasStore.getMeshConcepts();
        const pathViews = this.registry.stores.canvasStore.getPathConcepts();

        return {
            pluginId: this.plugin.getId(),
            viewGroups: [
                {
                    viewType: ConceptType.MeshConcept,
                    views: meshViews.map(meshView => meshView.toJson())
                },
                {
                    viewType: ConceptType.PathConcept,
                    views: pathViews.map(pathView => pathView.toJson())
                }
            ]
        }
    }
}