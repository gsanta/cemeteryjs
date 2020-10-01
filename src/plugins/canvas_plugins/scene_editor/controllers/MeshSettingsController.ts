import { AssetObj, AssetType } from '../../../../core/models/objs/AssetObj';
import { MeshView } from '../../../../core/models/views/MeshView';
import { PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from '../../../../core/plugin/UI_Plugin';
import { toDegree, toRadian } from '../../../../utils/geometry/Measurements';
import { ThumbnailDialogPluginId } from '../ThumbnailDialogPlugin';

export enum MeshSettingsProps {
    MeshId = 'MeshId',
    Layer = 'Layer',
    Rotation = 'Rotation',
    Scale = 'Scale',
    YPos = 'YPos',
    Model = 'Model',
    Texture = 'Texture',
    Thumbnail = 'Thumbnail'
}

export class MeshIdController extends PropController<string> {

    constructor() {
        super(MeshSettingsProps.MeshId);
    }

    defaultVal(context) {
        return (<MeshView> context.registry.stores.viewStore.getOneSelectedView()).id;
    }
    
    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context) {
        context.releaseTempVal((val) => (<MeshView> context.registry.stores.viewStore.getOneSelectedView()).id = val);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }    
}

export class LayerController extends PropController<number> {

    constructor() {
        super(MeshSettingsProps.Layer);
    }

    defaultVal(context: PropContext) {
        const meshView = <MeshView> context.registry.stores.viewStore.getOneSelectedView();

        return meshView.layer;
    }

    change(val, context: PropContext) {
        const meshView = <MeshView> context.registry.stores.viewStore.getOneSelectedView();
        meshView.layer = val;
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

export class RotationController extends PropController<string> {
    
    constructor() {
        super(MeshSettingsProps.Rotation);
    }

    defaultVal(context: PropContext) {
        const meshView = <MeshView> context.registry.stores.viewStore.getOneSelectedView();

        return Math.round(toDegree(meshView.getRotation())).toString();
    }
    
    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context: PropContext) {
        const meshView = <MeshView> context.registry.stores.viewStore.getOneSelectedView();

        let rotation = meshView.getRotation();
        try {
            context.releaseTempVal((val) => rotation = toRadian(parseFloat(val)))
        } catch (e) {
            console.log(e);
        }
        meshView.setRotation(rotation);
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}


export class ScaleController extends PropController<string> {

    constructor() {
        super(MeshSettingsProps.Scale);
    }

    defaultVal(context: PropContext) {
        const meshView = <MeshView> context.registry.stores.viewStore.getOneSelectedView();

        return meshView.getScale();
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context: PropContext) {
        const meshView = <MeshView> context.registry.stores.viewStore.getOneSelectedView();

        let scale = meshView.getScale();
        try {
            context.releaseTempVal(val => scale = parseFloat(val));
        } catch (e) {
            console.log(e);
        }
        meshView.setScale(scale);
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

export class YPosController extends PropController<string> {

    constructor() {
        super(MeshSettingsProps.YPos);
    }

    defaultVal(context: PropContext) {
        const meshView = <MeshView> context.registry.stores.viewStore.getOneSelectedView();

        return meshView.yPos.toString();
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context: PropContext) {
        const meshView = <MeshView> context.registry.stores.viewStore.getOneSelectedView();

        let yPos = meshView.yPos;
        try {
            context.releaseTempVal(val => parseFloat(val))
        } catch(e) {
            console.log(e);
        }

        meshView.yPos = yPos;
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

export class TextureController extends PropController<string> {

    constructor() {
        super(MeshSettingsProps.Texture);
    }

    defaultVal(context) {
        const meshView = <MeshView> context.registry.stores.viewStore.getOneSelectedView();

        if (meshView.getObj().textureId) {
            const assetObj = context.registry.stores.assetStore.getAssetById(meshView.getObj().textureId);
            return assetObj.path
        }

        return '';
    }

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur(context) {
        const meshView = <MeshView> context.registry.stores.viewStore.getOneSelectedView();

        const val = context.getTempVal();
        context.clearTempVal();

        const asset = new AssetObj({path: val, assetType: AssetType.Texture});
        meshView.getObj().textureId = context.registry.stores.assetStore.addObj(asset);
        context.registry.services.localStore.saveAsset(asset);

        context.registry.engine.meshes.createMaterial(meshView.getObj());
        context.registry.services.history.createSnapshot();
    }
}

export class ThumbnailController extends PropController {

    constructor() {
        super(MeshSettingsProps.Thumbnail);
    }

    click(context) {
        context.registry.plugins.showPlugin(ThumbnailDialogPluginId);
    }
}

export class ModelController extends PropController<string> {

    constructor() {
        super(MeshSettingsProps.Model);
    }

    defaultVal(context) {
        const meshView = <MeshView> context.registry.stores.viewStore.getOneSelectedView();

        if (meshView.getObj().modelId) {
            const assetObj = context.registry.stores.assetStore.getAssetById(meshView.getObj().modelId);
            return assetObj.path
        }

        return '';
    }

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur(context) {
        const meshView = <MeshView> context.registry.stores.viewStore.getOneSelectedView();

        const val = context.getTempVal();
        context.clearTempVal();

        const asset = new AssetObj({path: val, assetType: AssetType.Model});
        meshView.getObj().modelId = context.registry.stores.assetStore.addObj(asset);
        context.registry.services.localStore.saveAsset(asset);
        context.registry.engine.meshes.deleteInstance(meshView.getObj());
        await context.registry.engine.meshes.createInstance(meshView.getObj())
        const realDimensions = context.registry.engine.meshes.getDimensions(meshView.getObj())
        meshView.getBounds().setWidth(realDimensions.x);
        meshView.getBounds().setHeight(realDimensions.y);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRenderAll();
    }
}