import { MeshLoaderService } from '../../../../core/services/MeshLoaderService';
import { AbstractPluginImporter } from "../../../../core/plugins/AbstractPluginImporter";

export class GameViewerImporter extends AbstractPluginImporter {
    import(): void {
        const meshLoaderService = this.plugin.pluginServices.byName<MeshLoaderService>(MeshLoaderService.serviceName);
        meshLoaderService.clear();
        this.registry.stores.gameStore.clear();
        this.registry.stores.meshStore.clear();

        meshLoaderService.loadAll(this.registry.stores.canvasStore.getMeshViews())
            .then(() => {
                const promises = this.registry.stores.canvasStore.getMeshViews().map(meshView => this.registry.stores.meshStore.createInstance(meshView.obj));
                return Promise.all(promises);
            })
            .then(() => {
                this.registry.stores.canvasStore.getMeshViews().forEach(meshView => this.registry.stores.meshStore.createMaterial(meshView.obj));
            })
            .catch(e => {
                console.log(e)
            })
        
        this.setMeshDimensions();
    }

    private setMeshDimensions() {
        const meshLoaderService = this.plugin.pluginServices.byName<MeshLoaderService>(MeshLoaderService.serviceName);
        this.registry.stores.canvasStore.getMeshViews().filter(item => item.obj.modelId)
            .forEach(item => {
                const asset = this.registry.stores.assetStore.getAssetById(item.obj.modelId);
                meshLoaderService.getDimensions(asset, item.id)
                    .then(dim => {
                        item.dimensions.setWidth(dim.x);
                        item.dimensions.setHeight(dim.y);
                    });
            });
    }
}