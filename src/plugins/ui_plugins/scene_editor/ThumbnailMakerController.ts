import { Tools } from 'babylonjs';
import { AbstractController } from '../../../core/plugins/controllers/AbstractController';
import { AssetObj, AssetType } from '../../../core/models/game_objects/AssetObj';
import { MeshView } from '../../../core/models/views/MeshView';
import { Registry } from '../../../core/Registry';
import { EngineService } from '../../../core/services/EngineService';
import { ThumbnailDialogPlugin } from './ThumbnailDialogPlugin';
import { UI_Region } from '../../../core/plugins/UI_Plugin';
import { IEngineFacade } from '../../../core/adapters/IEngineFacade';
import { BabylonEngineFacade } from '../../../core/adapters/babylonjs/BabylonEngineFacade';

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
                const meshView = this.registry.stores.selectionStore.getView() as MeshView;

                const thumbnail = await Tools.CreateScreenshotUsingRenderTargetAsync((plugin.engine as BabylonEngineFacade).engine, plugin.engine.getCamera().camera, 1000)
                meshView.thumbnailData = thumbnail;
                this.registry.services.history.createSnapshot();
                this.registry.services.render.reRender(UI_Region.Dialog);
            });

        this.createPropHandler<{data: string, path: string}>(ThumbnailMakerControllerProps.ThumbnailFromFile)
            .onChange((val) => {
                const meshView = this.registry.stores.selectionStore.getView() as MeshView;
                
                meshView.thumbnailData = val.data;
                this.registry.services.history.createSnapshot();
                this.registry.services.render.reRender(UI_Region.Dialog);
            });

        
        this.createPropHandler(ThumbnailMakerControllerProps.ClearThumbnail)
            .onClick(() => {                
                const meshView = this.registry.stores.selectionStore.getView() as MeshView;
 
                meshView.thumbnailData = undefined;
                this.registry.services.render.reRender(UI_Region.Dialog);
            });
    }
}