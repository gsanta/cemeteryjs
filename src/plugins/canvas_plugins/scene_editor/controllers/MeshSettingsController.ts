import { AssetObj, AssetType } from '../../../../core/models/objs/AssetObj';
import { MeshBoxConfig } from '../../../../core/models/objs/MeshObj';
import { MeshView } from '../../../../core/models/views/MeshView';
import { PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from '../../../../core/plugin/UI_Panel';
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
    Thumbnail = 'Thumbnail',
    Width = 'Width',
    Height = 'Height',
    Depth = 'Depth'
}

export class MeshIdController extends PropController<string> {
    acceptedProps() { return [MeshSettingsProps.MeshId]; }

    defaultVal(context) {
        return (<MeshView> context.registry.stores.views.getOneSelectedView()).id;
    }
    
    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context) {
        context.releaseTempVal((val) => (<MeshView> context.registry.stores.views.getOneSelectedView()).id = val);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }    
}

export class LayerController extends PropController<number> {
    acceptedProps() { return [MeshSettingsProps.Layer]; }

    defaultVal(context: PropContext) {
        const meshView = <MeshView> context.registry.stores.views.getOneSelectedView();

        return meshView.layer;
    }

    change(val, context: PropContext) {
        const meshView = <MeshView> context.registry.stores.views.getOneSelectedView();
        meshView.layer = val;
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

export class RotationController extends PropController<string> {
    acceptedProps() { return [MeshSettingsProps.Rotation]; }

    defaultVal(context: PropContext) {
        const meshView = <MeshView> context.registry.stores.views.getOneSelectedView();

        return Math.round(toDegree(meshView.getRotation())).toString();
    }
    
    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context: PropContext) {
        const meshView = <MeshView> context.registry.stores.views.getOneSelectedView();

        let rotation = meshView.getRotation();
        try {
            context.releaseTempVal((val) => rotation = toRadian(parseFloat(val)));
        } catch (e) {
            console.log(e);
        }
        meshView.setRotation(rotation);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}


export class ScaleController extends PropController<string> {
    acceptedProps() { return [MeshSettingsProps.Scale]; }

    defaultVal(context: PropContext) {
        const meshView = <MeshView> context.registry.stores.views.getOneSelectedView();

        return meshView.getScale();
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context: PropContext) {
        const meshView = <MeshView> context.registry.stores.views.getOneSelectedView();

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
    acceptedProps() { return [MeshSettingsProps.YPos]; }

    defaultVal(context: PropContext) {
        const meshView = <MeshView> context.registry.stores.views.getOneSelectedView();

        return meshView.yPos.toString();
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context: PropContext) {
        const meshView = <MeshView> context.registry.stores.views.getOneSelectedView();

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
    acceptedProps() { return [MeshSettingsProps.Texture]; }

    defaultVal(context) {
        const meshView = <MeshView> context.registry.stores.views.getOneSelectedView();

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
        const meshView = <MeshView> context.registry.stores.views.getOneSelectedView();

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
    acceptedProps() { return [MeshSettingsProps.Thumbnail]; }

    click(context: PropContext) {
        context.registry.plugins.showPlugin(ThumbnailDialogPluginId);
    }
}

export class ModelController extends PropController<string> {
    acceptedProps() { return [MeshSettingsProps.Model]; }

    defaultVal(context) {
        const meshView = <MeshView> context.registry.stores.views.getOneSelectedView();

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

    async blur(context: PropContext) {
        const meshView = <MeshView> context.registry.stores.views.getOneSelectedView();

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

export class WidthController extends PropController<string> {
    acceptedProps() { return [MeshSettingsProps.Width]; }

    defaultVal(context) {
        const meshView = <MeshView> context.registry.stores.views.getOneSelectedView();

        return (<MeshBoxConfig> meshView.getObj().shapeConfig).width;
    }

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur(context: PropContext) {
        const meshView = <MeshView> context.registry.stores.views.getOneSelectedView();
        try {
            const val = parseFloat(context.getTempVal());
            (<MeshBoxConfig> meshView.getObj().shapeConfig).width = val;
            context.registry.engine.meshes.deleteInstance(meshView.getObj());
            await context.registry.engine.meshes.createInstance(meshView.getObj());
        } catch (e) {
            console.log(e);
        }
        
        context.clearTempVal();

        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRenderAll();
    }
}

export class HeightController extends PropController<string> {
    acceptedProps() { return [MeshSettingsProps.Height]; }

    defaultVal(context) {
        const meshView = <MeshView> context.registry.stores.views.getOneSelectedView();

        return (<MeshBoxConfig> meshView.getObj().shapeConfig).height;
    }

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur(context: PropContext) {
        const meshView = <MeshView> context.registry.stores.views.getOneSelectedView();
        try {
            const val = parseFloat(context.getTempVal());
            (<MeshBoxConfig> meshView.getObj().shapeConfig).height = val;
            context.registry.engine.meshes.deleteInstance(meshView.getObj());
            await context.registry.engine.meshes.createInstance(meshView.getObj())
        } catch (e) {
            console.log(e);
        }
        
        context.clearTempVal();

        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRenderAll();
    }
}

export class DepthController extends PropController<string> {
    acceptedProps() { return [MeshSettingsProps.Depth]; }

    defaultVal(context) {
        const meshView = <MeshView> context.registry.stores.views.getOneSelectedView();

        return (<MeshBoxConfig> meshView.getObj().shapeConfig).depth;
    }

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur(context: PropContext) {
        const meshView = <MeshView> context.registry.stores.views.getOneSelectedView();
        try {
            const val = parseFloat(context.getTempVal());
            (<MeshBoxConfig> meshView.getObj().shapeConfig).depth = val;
            context.registry.engine.meshes.deleteInstance(meshView.getObj());
            await context.registry.engine.meshes.createInstance(meshView.getObj());

        } catch (e) {
            console.log(e);
        }
        
        context.clearTempVal();

        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRenderAll();
    }
}