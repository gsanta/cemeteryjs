import { Tools } from "babylonjs";
import { AssetModel, AssetType } from "../../../core/stores/game_objects/AssetModel";
import { MeshView } from "../../../core/stores/views/MeshView";
import { EngineService } from "../../../core/services/EngineService";

export class ThumbnailMaker {
    
    async createThumbnail(meshView: MeshView, engineService: EngineService): Promise<AssetModel> {
        const data = await Tools.CreateScreenshotUsingRenderTargetAsync(engineService.getEngine(), engineService.getCamera().camera, 1000)
                
        const assetModel = new AssetModel({data: data, assetType: AssetType.Thumbnail});
        meshView.thumbnailId = assetModel.id;

        return assetModel;
    }
}
