import { AbstractPluginService } from "../../common/AbstractPluginService";
import { AbstractPlugin } from "../../../core/AbstractPlugin";
import { MeshLoaderService } from "../../../core/services/MeshLoaderService";
import { AssetModel } from "../../../core/stores/AssetStore";
import { Tools } from "babylonjs";

export class ThumbnailMakerService extends AbstractPluginService<AbstractPlugin> {
    static serviceName = 'thumbnail-maker-service';
    serviceName = ThumbnailMakerService.serviceName;

    createThumbnail(assetModel: AssetModel) {
        const engineService = this.plugin.pluginServices.engineService();
        const meshLoaderService = this.plugin.pluginServices.byName<MeshLoaderService>(MeshLoaderService.serviceName);

        // meshLoaderService.load(assetModel, '123')
        //     .then(mesh => {
        Tools.CreateScreenshotUsingRenderTarget(engineService.getEngine(), engineService.getCamera().camera, 1000, (data) => {
            assetModel.thumbnailData = data;
        });
                // }
            // );
    }
}
