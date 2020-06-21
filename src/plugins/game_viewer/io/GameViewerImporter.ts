import { MeshLoaderService } from '../../../core/services/MeshLoaderService';
import { AbstractPluginImporter } from "../../common/io/AbstractPluginImporter";

export class GameViewerImporter extends AbstractPluginImporter {
    import(): void {
        const meshLoaderService = this.plugin.pluginServices.byName<MeshLoaderService>(MeshLoaderService.serviceName);
        meshLoaderService.clear();
        this.registry.stores.gameStore.clear();
        this.registry.stores.meshStore.clear();

        meshLoaderService.loadAll(this.registry.stores.canvasStore.getMeshViews())
            .then(() => {
                const promises = this.registry.stores.canvasStore.getMeshViews().map(meshView => this.registry.stores.meshStore.createInstance(meshView.model));
                return Promise.all(promises);
            })
            .then(() => {
                this.registry.stores.canvasStore.getMeshViews().forEach(meshView => this.registry.stores.meshStore.createMaterial(meshView.model));
            })
            .catch(e => {
                console.log(e)
            })
        
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