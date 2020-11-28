import { AssetObj, AssetType } from '../../../../core/models/objs/AssetObj';
import { MeshBoxConfig } from '../../../../core/models/objs/MeshObj';
import { MeshView } from './MeshView';
import { PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from '../../../../core/plugin/UI_Panel';
import { toDegree, toRadian } from '../../../../utils/geometry/Measurements';
import { ThumbnailDialogPanelId } from '../../../dialog_plugins/thumbnail/registerThumbnailDialog';
import { Registry } from '../../../../core/Registry';
import { ApplicationError } from '../../../../core/services/ErrorService';
import { Point_3 } from '../../../../utils/geometry/shapes/Point_3';
import { CanvasAxis } from '../../../../core/models/misc/CanvasAxis';

export enum MeshViewControllerParam {
    MeshId = 'MeshId',
    Layer = 'Layer',
    Rotation = 'rotation',
    ScaleX = 'scale-x',
    ScaleY = 'scale-y',
    ScaleZ = 'scale-z',
    YPos = 'YPos',
    Model = 'model',
    Texture = 'texture',
    Thumbnail = 'Thumbnail',
    Width = 'Width',
    Height = 'Height',
    Depth = 'Depth',
    Color = 'Color'
}

export class MeshIdController extends PropController<string> {
    acceptedProps() { return [MeshViewControllerParam.MeshId]; }

    defaultVal(context) {
        return (<MeshView> context.registry.data.view.scene.getOneSelectedView()).id;
    }
    
    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context) {
        context.releaseTempVal((val) => (<MeshView> context.registry.data.view.scene.getOneSelectedView()).id = val);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }    
}

export class LayerController extends PropController<number> {
    acceptedProps() { return [MeshViewControllerParam.Layer]; }

    defaultVal(context: PropContext) {
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();

        return meshView.layer;
    }

    change(val, context: PropContext) {
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();
        meshView.layer = val;
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

export class RotationController extends PropController<string> {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    acceptedProps() { return [MeshViewControllerParam.Rotation]; }

    defaultVal(context: PropContext) {
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();

        return Math.round(toDegree(meshView.getRotation())).toString();
    }
    
    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context: PropContext) {
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();

        try {
            if (context.getTempVal() !== undefined && context.getTempVal() !== "") {
                meshView.setRotation(toRadian(parseFloat(context.getTempVal())));
                context.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            context.clearTempVal();
        }

        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

export class ScaleController extends PropController<string> {
    private registry: Registry;
    private axis: CanvasAxis;
    private param: MeshViewControllerParam;

    constructor(registry: Registry, axis: CanvasAxis, param: MeshViewControllerParam) {
        super();
        this.registry = registry;
        this.axis = axis;
        this.param = param;
    }

    acceptedProps() { return [this.param]; }

    defaultVal(context: PropContext) {
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();

        return CanvasAxis.getAxisVal(meshView.getObj().getScale(), this.axis);
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context: PropContext) {
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();
        
        try {
            if (context.getTempVal() !== undefined && context.getTempVal() !== "") {
                const scale = meshView.getObj().getScale();
                const axisScale = parseFloat(context.getTempVal());
                CanvasAxis.setAxisVal(scale, this.axis, axisScale);
                meshView.getObj().setScale(scale);
                context.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            context.clearTempVal();
        }

        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

export class YPosController extends PropController<string> {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    acceptedProps() { return [MeshViewControllerParam.YPos]; }

    defaultVal(context: PropContext) {
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();

        return meshView.yPos.toString();
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context: PropContext) {
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();

        try {
            if (context.getTempVal() !== undefined && context.getTempVal() !== "") {
                meshView.yPos = parseFloat(context.getTempVal());
                context.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            context.clearTempVal();
        }

        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

export class TextureController extends PropController<string> {
    acceptedProps() { return [MeshViewControllerParam.Texture]; }

    defaultVal(context) {
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();

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

    async blur(context: PropContext) {
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();
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
    acceptedProps() { return [MeshViewControllerParam.Thumbnail]; }

    click(context: PropContext) {
        const dialog = context.registry.ui.panel.getPanel(ThumbnailDialogPanelId);
        context.registry.ui.helper.setDialogPanel(dialog);
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class ModelController extends PropController<string> {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    acceptedProps() { return [MeshViewControllerParam.Model]; }

    defaultVal(context) {
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();

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
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();

        const val = context.getTempVal();
        context.clearTempVal();

        const asset = new AssetObj({path: val, assetType: AssetType.Model});
        meshView.getObj().modelId = context.registry.stores.assetStore.addObj(asset);
        context.registry.services.localStore.saveAsset(asset);
        try {
            await context.registry.engine.meshes.createInstance(meshView.getObj())
            const realDimensions = context.registry.engine.meshes.getDimensions(meshView.getObj())
            meshView.getBounds().setWidth(realDimensions.x);
            meshView.getBounds().setHeight(realDimensions.y);
            context.registry.services.history.createSnapshot();
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        }
        context.registry.services.render.reRenderAll();
    }
}

export class WidthController extends PropController<string> {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    acceptedProps() { return [MeshViewControllerParam.Width]; }

    defaultVal(context) {
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();

        return (<MeshBoxConfig> meshView.getObj().shapeConfig).width;
    }

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur(context: PropContext) {
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();

        try {
            if (context.getTempVal() !== undefined && context.getTempVal() !== "") {
                (<MeshBoxConfig> meshView.getObj().shapeConfig).width = parseFloat(context.getTempVal());
                context.registry.engine.meshes.deleteInstance(meshView.getObj());
                await context.registry.engine.meshes.createInstance(meshView.getObj());
                context.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            context.clearTempVal();
        }

        context.registry.services.render.reRenderAll();
    }
}

export class HeightController extends PropController<string> {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    acceptedProps() { return [MeshViewControllerParam.Height]; }

    defaultVal(context) {
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();

        return (<MeshBoxConfig> meshView.getObj().shapeConfig).height;
    }

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur(context: PropContext) {
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();

        try {
            if (context.getTempVal() !== undefined && context.getTempVal() !== "") {
                (<MeshBoxConfig> meshView.getObj().shapeConfig).height = parseFloat(context.getTempVal());
                context.registry.engine.meshes.deleteInstance(meshView.getObj());
                await context.registry.engine.meshes.createInstance(meshView.getObj())
                context.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            context.clearTempVal();
        }

        context.registry.services.render.reRenderAll();
    }
}

export class DepthController extends PropController<string> {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    acceptedProps() { return [MeshViewControllerParam.Depth]; }

    defaultVal(context) {
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();

        return (<MeshBoxConfig> meshView.getObj().shapeConfig).depth;
    }

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur(context: PropContext) {
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();

        try {
            if (context.getTempVal() !== undefined && context.getTempVal() !== "") {
                (<MeshBoxConfig> meshView.getObj().shapeConfig).depth = parseFloat(context.getTempVal());
                context.registry.engine.meshes.deleteInstance(meshView.getObj());
                await context.registry.engine.meshes.createInstance(meshView.getObj())
                context.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            context.clearTempVal();
        }
        

        context.registry.services.render.reRenderAll();
    }
}

export class ColorController extends PropController<string> {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    acceptedProps() { return [MeshViewControllerParam.Color]; }

    defaultVal(context) {
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();

        return meshView.getObj().getColor();
    }

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur(context: PropContext) {
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();

        try {
            if (context.getTempVal() !== undefined && context.getTempVal() !== "") {
                meshView.getObj().setColor(context.getTempVal());
                context.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            context.clearTempVal();
        }
        

        context.registry.services.render.reRenderAll();
    }
}