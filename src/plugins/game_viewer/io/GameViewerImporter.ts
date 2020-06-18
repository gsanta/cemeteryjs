import { MeshLoaderService } from '../../../core/services/MeshLoaderService';
import { AbstractPluginImporter } from "../../common/io/AbstractPluginImporter";

export class GameViewerImporter extends AbstractPluginImporter {
    import(): void {
        const meshLoaderService = this.plugin.pluginServices.byName<MeshLoaderService>(MeshLoaderService.serviceName);
        meshLoaderService.clear();

        meshLoaderService.loadAll(this.registry.stores.canvasStore.getMeshViews())
            .then(() => {
                this.registry.stores.canvasStore.getMeshViews().forEach(meshView => this.registry.stores.meshStore.createInstance(meshView.model));
            });
        
        this.setMeshDimensions();
    }

    private setMeshDimensions() {
        const meshLoaderService = this.plugin.pluginServices.byName<MeshLoaderService>(MeshLoaderService.serviceName);
        this.registry.stores.canvasStore.getMeshViews().filter(item => item.modelId)
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