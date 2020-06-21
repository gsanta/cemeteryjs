import { AbstractPluginService } from "../../common/AbstractPluginService";
import { AbstractPlugin } from "../../../core/AbstractPlugin";
import { MeshLoaderService } from "../../../core/services/MeshLoaderService";
import { Tools } from "babylonjs";
import { MeshView } from "../../../core/models/views/MeshView";
import { Point } from "../../../core/geometry/shapes/Point";
import { AssetModel, AssetType } from "../../../core/models/game_objects/AssetModel";

export class ThumbnailMakerService extends AbstractPluginService<AbstractPlugin> {
    static serviceName = 'thumbnail-maker-service';
    serviceName = ThumbnailMakerService.serviceName;

    private meshView: MeshView;

    loadSelectedMeshView() {
        const meshView = this.registry.stores.selectionStore.getView() as MeshView;
        const assetModel = this.registry.stores.assetStore.getAssetById(meshView.modelId);

        return this.plugin.pluginServices.byName<MeshLoaderService>(MeshLoaderService.serviceName).load(assetModel, meshView.id)
            .then(() => this.meshView = meshView);
    }

    createThumbnail(meshView: MeshView) {
        const engineService = this.plugin.pluginServices.engineService();

        Tools.CreateScreenshotUsingRenderTarget(engineService.getEngine(), engineService.getCamera().camera, 1000, (data) => {
            // assetModel.thumbnailData = data;
            const assetModel = new AssetModel({data: data, assetType: AssetType.Thumbnail});
            this.registry.stores.assetStore.addAsset(assetModel);
            this.registry.services.localStore.saveAsset(assetModel);
            meshView.thumbnailId = assetModel.getId();
        });
    }
}
