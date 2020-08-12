import { Tools } from 'babylonjs';
import { AbstractController } from '../../core/plugins/controllers/AbstractController';
import { AssetModel, AssetType } from '../../core/stores/game_objects/AssetModel';
import { MeshView } from '../../core/stores/views/MeshView';
import { Registry } from '../../core/Registry';
import { EngineService } from '../../core/services/EngineService';
import { ThumbnailDialogPlugin } from './ThumbnailDialogPlugin';
import { UI_Region } from '../../core/plugins/UI_Plugin';

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
                const assetModel = await this.createThumbnail(plugin.meshView, plugin.pluginServices.engineService());                
                this.registry.stores.assetStore.addAsset(assetModel);
                this.registry.services.localStore.saveAsset(assetModel);
                plugin.meshView.thumbnailId = assetModel.id;

                this.registry.services.render.reRender(UI_Region.Dialog);
            });

        this.createPropHandler<{data: string, path: string}>(ThumbnailMakerControllerProps.ThumbnailFromFile)
            .onChange((val) => {
                const assetModel = new AssetModel({data: val.data, path: val.path, assetType: AssetType.Thumbnail});
                this.registry.stores.assetStore.addAsset(assetModel);
                this.registry.services.localStore.saveAsset(assetModel);
                plugin.meshView.thumbnailId = assetModel.id;

                this.registry.services.render.reRender(UI_Region.Dialog);
            });

        
        this.createPropHandler(ThumbnailMakerControllerProps.ClearThumbnail)
            .onClick(() => {
                const thumbnailId = plugin.meshView.thumbnailId;
                
                if (thumbnailId) {
                    const assetModel = this.registry.stores.assetStore.getAssetById(thumbnailId);
                    this.registry.stores.assetStore.deleteAsset(assetModel);

                    plugin.meshView.thumbnailId = undefined;
                    this.registry.services.render.reRender(UI_Region.Dialog);
                }
            });
    }

    async createThumbnail(meshView: MeshView, engineService: EngineService): Promise<AssetModel> {
        const data = await Tools.CreateScreenshotUsingRenderTargetAsync(engineService.getEngine(), engineService.getCamera().camera, 1000)
                
        const assetModel = new AssetModel({data: data, assetType: AssetType.Thumbnail});
        meshView.thumbnailId = assetModel.id;

        return assetModel;
    }
}