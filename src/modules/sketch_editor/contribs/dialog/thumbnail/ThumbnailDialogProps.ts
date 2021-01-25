import { Tools } from "babylonjs";
import { Bab_EngineFacade } from "../../../../../core/engine/adapters/babylonjs/Bab_EngineFacade";
import { MeshShape } from "../../../main/models/shapes/MeshShape";
import { Canvas3dPanel } from "../../../../../core/plugin/Canvas3dPanel";
import { ParamController, PropContext } from '../../../../../core/controller/FormController';
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { UI_Element } from "../../../../../core/ui_components/elements/UI_Element";

export enum ThumbnailMakerControllerProps {
    ThumbnailCreate = 'ThumbnailFromModel',
    ThumbnailUpload = 'ThumbnailFromFile',
    ClearThumbnail = 'ClearThumbnail'
}

export class ThumbnailCreateControl extends ParamController<any> {
    acceptedProps() { return [ThumbnailMakerControllerProps.ThumbnailCreate]; }
    
    async click(context: PropContext, element: UI_Element) {
        const engine = (<Canvas3dPanel> element.canvasPanel).engine;
        const meshView = context.registry.data.shape.scene.getOneSelectedShape() as MeshShape;

        // TODO: should not cast to Bab_EngineFacade
        const thumbnail = await Tools.CreateScreenshotUsingRenderTargetAsync((engine as Bab_EngineFacade).engine, engine.getCamera().camera, 1000)
        meshView.thumbnailData = thumbnail;
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class ThumbnailUploadControl extends ParamController<any> {
    acceptedProps() { return [ThumbnailMakerControllerProps.ThumbnailUpload]; }

    change(val, context) {
        const meshView = context.registry.stores.views.getOneSelectedView() as MeshShape;
                
        meshView.thumbnailData = val.data;
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class ClearThumbnailControl extends ParamController<any> {
    acceptedProps() { return [ThumbnailMakerControllerProps.ClearThumbnail]; }

    change(val, context) {
        const meshView = context.registry.stores.views.getOneSelectedView() as MeshShape;
 
        meshView.thumbnailData = undefined;
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}