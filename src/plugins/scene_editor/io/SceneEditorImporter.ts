import { MeshView, MeshViewJson } from '../../../core/models/views/MeshView';
import { PathView, PathViewJson } from '../../../core/models/views/PathView';
import { ConceptType, View } from "../../../core/models/views/View";
import { Registry } from "../../../core/Registry";
import { AbstractPluginImporter } from "../../common/io/AbstractPluginImporter";
import { IPluginJson } from "../../common/io/IPluginExporter";

export class SceneEditorImporter extends AbstractPluginImporter {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    import(pluginJson: IPluginJson, viewMap: Map<string, View>): void {
        const meshJsons = pluginJson.viewGroups.find(viewGroup => viewGroup.viewType === ConceptType.MeshConcept);

        meshJsons.views.forEach((viewJson: MeshViewJson) => {
            const meshView: MeshView = new MeshView();
            meshView.fromJson(viewJson, viewMap);

            this.registry.stores.canvasStore.addConcept(meshView);
        });

        const pathJsons = pluginJson.viewGroups.find(viewGroup => viewGroup.viewType === ConceptType.PathConcept);

        pathJsons.views.forEach((viewJson: PathViewJson) => {
            const pathView: PathView = new PathView();
            pathView.fromJson(viewJson, viewMap);

            this.registry.stores.canvasStore.addConcept(pathView);
        });
    }
}