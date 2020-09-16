import { Tools } from 'babylonjs';
import { Bab_EngineFacade } from '../../../core/adapters/babylonjs/Bab_EngineFacade';
import { MeshView } from '../../../core/models/views/MeshView';
import { AbstractController } from '../../../core/plugins/controllers/AbstractController';
import { UI_Region } from '../../../core/plugins/UI_Plugin';
import { Registry } from '../../../core/Registry';
import { ThumbnailDialogPlugin } from './ThumbnailDialogPlugin';

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
                const meshView = this.registry.stores.selectionStore.getOneSelectedView() as MeshView;

                const thumbnail = await Tools.CreateScreenshotUsingRenderTargetAsync((plugin.engine as Bab_EngineFacade).engine, plugin.engine.getCamera().camera, 1000)
                meshView.thumbnailData = thumbnail;
                this.registry.services.history.createSnapshot();
                this.registry.services.render.reRender(UI_Region.Dialog);
            });

        this.createPropHandler<{data: string, path: string}>(ThumbnailMakerControllerProps.ThumbnailFromFile)
            .onChange((val) => {
                const meshView = this.registry.stores.selectionStore.getOneSelectedView() as MeshView;
                
                meshView.thumbnailData = val.data;
                this.registry.services.history.createSnapshot();
                this.registry.services.render.reRender(UI_Region.Dialog);
            });

        
        this.createPropHandler(ThumbnailMakerControllerProps.ClearThumbnail)
            .onClick(() => {                
                const meshView = this.registry.stores.selectionStore.getOneSelectedView() as MeshView;
 
                meshView.thumbnailData = undefined;
                this.registry.services.render.reRender(UI_Region.Dialog);
            });
    }
}