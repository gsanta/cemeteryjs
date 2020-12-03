import { AssetObj, AssetType } from '../../../../core/models/objs/AssetObj';
import { MeshBoxConfig } from '../../../../core/models/objs/MeshObj';
import { MeshView } from './MeshView';
import { PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from '../../../../core/plugin/UI_Panel';
import { toDegree, toRadian } from '../../../../utils/geometry/Measurements';
import { ThumbnailDialogPanelId } from '../../../dialog_plugins/thumbnail/registerThumbnailDialog';
import { Registry } from '../../../../core/Registry';
import { ApplicationError } from '../../../../core/services/ErrorService';
import { CanvasAxis } from '../../../../core/models/misc/CanvasAxis';
import { UI_Element } from '../../../../core/ui_components/elements/UI_Element';
import { Canvas2dPanel } from '../../../../core/plugin/Canvas2dPanel';
import { Point } from '../../../../utils/geometry/shapes/Point';

export enum MeshViewControllerParam {
    MeshId = 'MeshId',
    Layer = 'Layer',
    RotX = 'rot-x',
    RotY = 'rot-y',
    RotZ = 'rot-z',
    ScaleX = 'scale-x',
    ScaleY = 'scale-y',
    ScaleZ = 'scale-z',
    PosX = 'pos-x',
    PosY = 'pos-y',
    PosZ = 'pos-z',
    Model = 'model',
    Texture = 'texture',
    Thumbnail = 'Thumbnail',
    Width = 'width',
    Height = 'height',
    Depth = 'depth',
    Color = 'Color',
    Clone = 'clone'
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

// export class RotationController extends PropController<string> {
//     private registry: Registry;

//     constructor(registry: Registry) {
//         super();
//         this.registry = registry;
//     }

//     acceptedProps() { return [MeshViewControllerParam.Rotation]; }

//     defaultVal(context: PropContext) {
//         const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();

//         return Math.round(toDegree(meshView.getRotation())).toString();
//     }
    
//     change(val, context) {
//         context.updateTempVal(val);
//         context.registry.services.render.reRender(UI_Region.Sidepanel);
//     }

//     blur(context: PropContext) {
//         const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();

//         try {
//             if (context.getTempVal() !== undefined && context.getTempVal() !== "") {
//                 meshView.setRotation(toRadian(parseFloat(context.getTempVal())));
//                 context.registry.services.history.createSnapshot();
//             }
//         } catch(e) {
//             this.registry.services.error.setError(new ApplicationError(e));
//         } finally {
//             context.clearTempVal();
//         }

//         context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
//     }
// }

export class ScaleController extends PropController<string> {
    private registry: Registry;
    private axis: CanvasAxis;
    private param: MeshViewControllerParam;

    constructor(registry: Registry, axis: CanvasAxis) {
        super();
        this.registry = registry;
        this.axis = axis;
        this.param = axis === CanvasAxis.X ? MeshViewControllerParam.ScaleX : axis === CanvasAxis.Y ? MeshViewControllerParam.ScaleY : MeshViewControllerParam.ScaleZ;
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

export class RotationController extends PropController<string> {
    private registry: Registry;
    private axis: CanvasAxis;
    private param: MeshViewControllerParam;

    constructor(registry: Registry, axis: CanvasAxis) {
        super();
        this.registry = registry;
        this.axis = axis;
        this.param = axis === CanvasAxis.X ? MeshViewControllerParam.RotX : axis === CanvasAxis.Y ? MeshViewControllerParam.RotY : MeshViewControllerParam.RotZ;
    }

    acceptedProps() { return [this.param]; }

    defaultVal(context: PropContext) {
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();

        const rotRad = CanvasAxis.getAxisVal(meshView.getObj().getRotation(), this.axis);
        return Math.round(toDegree(rotRad));
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context: PropContext) {
        console.log('rot controller')
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();

        try {
            if (context.getTempVal() !== undefined && context.getTempVal() !== "") {
                const rotation = meshView.getObj().getRotation();
                const rot = toRadian(parseFloat(context.getTempVal()));
                
                if (this.axis === CanvasAxis.Y) {
                    meshView.setRotation(rot);
                } else {
                    CanvasAxis.setAxisVal(rotation, this.axis, rot);
                    meshView.getObj().setRotation(rotation)
                }

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

export class PositionController extends PropController<string> {
    private registry: Registry;
    private axis: CanvasAxis;
    private param: MeshViewControllerParam;

    constructor(registry: Registry, axis: CanvasAxis) {
        super();
        this.registry = registry;
        this.axis = axis;
        this.param = axis === CanvasAxis.X ? MeshViewControllerParam.PosX : axis === CanvasAxis.Y ? MeshViewControllerParam.PosY : MeshViewControllerParam.PosZ;
    }

    acceptedProps() { return [this.param]; }

    defaultVal(context: PropContext) {
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();

        return CanvasAxis.getAxisVal(meshView.getObj().getPosition(), this.axis);
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context: PropContext) {
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();
        
        try {
            if (context.getTempVal() !== undefined && context.getTempVal() !== "") {
                const position = meshView.getObj().getPosition();
                const axisPosition = parseFloat(context.getTempVal());
                CanvasAxis.setAxisVal(position, this.axis, axisPosition);
                meshView.getObj().setPosition(position);
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

export class CloneController extends PropController {
    acceptedProps() { return [MeshViewControllerParam.Clone]; }

    click(context: PropContext, element: UI_Element) {
        console.log('cloning')
        const meshView = <MeshView> context.registry.data.view.scene.getOneSelectedView();
        meshView.deepClone(context.registry);

        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRenderAll();
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