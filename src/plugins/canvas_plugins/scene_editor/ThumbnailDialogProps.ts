import { Tools } from "babylonjs";
import { Bab_EngineFacade } from "../../../core/engine/adapters/babylonjs/Bab_EngineFacade";
import { MeshView } from "../../../core/models/views/MeshView";
import { PropController } from "../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../core/plugin/UI_Plugin";
import { ThumbnailDialogPlugin } from "./ThumbnailDialogPlugin";

export enum ThumbnailMakerControllerProps {
    ThumbnailCreate = 'ThumbnailFromModel',
    ThumbnailUpload = 'ThumbnailFromFile',
    ClearThumbnail = 'ClearThumbnail'
}

export class ThumbnailCreateControl extends PropController<any> {
    acceptedProps() { return [ThumbnailMakerControllerProps.ThumbnailCreate]; }
    
    async click(context) {
        const engine = (<ThumbnailDialogPlugin> context.plugin).engine;
        const meshView = context.registry.stores.viewStore.getOneSelectedView() as MeshView;

        // TODO: should not cast to Bab_EngineFacade
        const thumbnail = await Tools.CreateScreenshotUsingRenderTargetAsync((engine as Bab_EngineFacade).engine, engine.getCamera().camera, 1000)
        meshView.thumbnailData = thumbnail;
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class ThumbnailUploadControl extends PropController<any> {
    acceptedProps() { return [ThumbnailMakerControllerProps.ThumbnailUpload]; }

    change(val, context) {
        const meshView = context.registry.stores.viewStore.getOneSelectedView() as MeshView;
                
        meshView.thumbnailData = val.data;
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class ClearThumbnailControl extends PropController<any> {
    acceptedProps() { return [ThumbnailMakerControllerProps.ClearThumbnail]; }

    change(val, context) {
        const meshView = context.registry.stores.viewStore.getOneSelectedView() as MeshView;
 
        meshView.thumbnailData = undefined;
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}
