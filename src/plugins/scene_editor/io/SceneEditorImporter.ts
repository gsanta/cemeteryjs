import { MeshView, MeshViewJson } from '../../../core/models/views/MeshView';
import { PathView, PathViewJson } from '../../../core/models/views/PathView';
import { ConceptType, View } from "../../../core/models/views/View";
import { AppJson } from '../../../core/services/export/ExportService';
import { AbstractPluginImporter } from "../../common/io/AbstractPluginImporter";
import { MeshLoaderService } from '../../../core/services/MeshLoaderService';

export class SceneEditorImporter extends AbstractPluginImporter {
    import(json: AppJson, viewMap: Map<string, View>): void {
        const pluginJson = this.getPluginJson(json);

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

        this.setMeshDimensions();
    }

    private setMeshDimensions() {
        const meshLoaderService = this.plugin.pluginServices.byName<MeshLoaderService>(MeshLoaderService.serviceName);
        this.registry.stores.canvasStore.getMeshConcepts().filter(item => item.modelId)
            .forEach(item => {
                const assetModel = this.registry.stores.assetStore.getAssetById(item.modelId);
                meshLoaderService.getDimensions(assetModel, item.id)
                    .then(dim => {
                        item.dimensions.setWidth(dim.x);
                        item.dimensions.setHeight(dim.y);
                    });

                meshLoaderService.getAnimations(assetModel, item.id)
                    .then(animations => {
                        item.animations = animations;
                    })
            });
    }
}