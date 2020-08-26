import { Tools } from 'babylonjs';
import { AbstractController } from '../../../core/plugins/controllers/AbstractController';
import { AssetObj, AssetType } from '../../../core/models/game_objects/AssetObj';
import { MeshView } from '../../../core/models/views/MeshView';
import { Registry } from '../../../core/Registry';
import { EngineService } from '../../../core/services/EngineService';
import { ThumbnailDialogPlugin } from './ThumbnailDialogPlugin';
import { UI_Region } from '../../../core/plugins/UI_Plugin';

export enum ThumbnailMakerControllerProps {
    ThumbnailFromModel = 'ThumbnailFromModel',
    ThumbnailFromFile = 'ThumbnailFromFile',
    ClearThumbnail = 'ClearThumbnail'
}

export const ThumbnailMakerControllerId = 'thumbnail_maker_controller_id';

export class ThumbnailMakerController extends AbstractController<ThumbnailMakerControllerProps> {
    id = ThumbnailMakerControllerId;

    constructor(plugin: ThumbnailDialogPlugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler(ThumbnailMakerControllerProps.ThumbnailFromModel)
            .onClick(async () => {
                const asset = await this.createThumbnail(plugin.meshView, plugin.pluginServices.engineService());                
                this.registry.stores.assetStore.addObj(asset);
                this.registry.services.localStore.saveAsset(asset);
                plugin.meshView.thumbnailId = asset.id;

                this.registry.services.render.reRender(UI_Region.Dialog);
            });

        this.createPropHandler<{data: string, path: string}>(ThumbnailMakerControllerProps.ThumbnailFromFile)
            .onChange((val) => {
                const asset = new AssetObj({data: val.data, path: val.path, assetType: AssetType.Thumbnail});
                this.registry.stores.assetStore.addObj(asset);
                this.registry.services.localStore.saveAsset(asset);
                plugin.meshView.thumbnailId = asset.id;

                this.registry.services.render.reRender(UI_Region.Dialog);
            });

        
        this.createPropHandler(ThumbnailMakerControllerProps.ClearThumbnail)
            .onClick(() => {
                const thumbnailId = plugin.meshView.thumbnailId;
                
                if (thumbnailId) {
                    const asset = this.registry.stores.assetStore.getAssetById(thumbnailId);
                    this.registry.stores.assetStore.deleteAsset(asset);

                    plugin.meshView.thumbnailId = undefined;
                    this.registry.services.render.reRender(UI_Region.Dialog);
                }
            });
    }

    async createThumbnail(meshView: MeshView, engineService: EngineService): Promise<AssetObj> {
        const data = await Tools.CreateScreenshotUsingRenderTargetAsync(engineService.getEngine(), engineService.getCamera().camera, 1000)
                
        const asset = new AssetObj({data: data, assetType: AssetType.Thumbnail});
        meshView.thumbnailId = asset.id;

        return asset;
    }
}