import { toDegree, toRadian } from '../../../../utils/geometry/Measurements';
import { MeshView } from '../../../../core/models/views/MeshView';
import { Registry } from '../../../../core/Registry';
import { AbstractController, PropControl } from '../../../../core/plugin/controller/AbstractController';
import { ThumbnailDialogPluginId } from '../ThumbnailDialogPlugin';
import { AssetObj, AssetType } from '../../../../core/models/objs/AssetObj';
import { ObjectSettingsPlugin } from './ObjectSettingsPlugin';
import { UI_Region } from '../../../../core/plugin/UI_Plugin';

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

export const MeshSettingsControllerId = 'mesh-settings-controller';

export class MeshSettingsController extends AbstractController<MeshSettingsProps> {
    id = MeshSettingsControllerId;
    // TODO user context instead of tempval
    tempVal: any;
    meshView: MeshView;

    constructor(plugin: ObjectSettingsPlugin,registry: Registry) {
        super(plugin, registry);
        this.plugin = plugin;

        this.registerPropControl(MeshSettingsProps.MeshId, IdControl)
        this.registerPropControl(MeshSettingsProps.Layer, LayerControl);
        this.registerPropControl(MeshSettingsProps.Rotation, RotationControl);
        this.registerPropControl(MeshSettingsProps.Scale, ScaleControl);
        this.registerPropControl(MeshSettingsProps.YPos, YPosControl);
        this.registerPropControl(MeshSettingsProps.Model, ModelControl);
        this.registerPropControl(MeshSettingsProps.Texture, TextureControl);
        this.registerPropControl(MeshSettingsProps.Thumbnail, ThumbnailControl);
    }
}

const IdControl: PropControl<string> = {
    defaultVal(context, element, controller: MeshSettingsController) {
        return (<MeshView> context.registry.stores.canvasStore.getOneSelectedView()).id;
    },
    
    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    },

    blur(context, element, controller: MeshSettingsController) {
        context.releaseTempVal((val) => (<MeshView> context.registry.stores.canvasStore.getOneSelectedView()).id = val);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }    
}

const LayerControl: PropControl<number> = {
    defaultVal(context, element, controller: MeshSettingsController) {
        return controller.meshView.layer;
    },

    change(val, context, element, controller: MeshSettingsController) {
        controller.meshView.layer = val;
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

const RotationControl: PropControl<string> = {
    defaultVal(context, element, controller: MeshSettingsController) {
        return Math.round(toDegree(controller.meshView.getRotation())).toString();
    },
    
    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    },

    blur(context, element, controller: MeshSettingsController) {
        let rotation = controller.meshView.getRotation();
        try {
            context.releaseTempVal((val) => rotation = toRadian(parseFloat(val)))
        } catch (e) {
            console.log(e);
        }
        controller.meshView.setRotation(rotation);
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}


const ScaleControl: PropControl<string> = {
    defaultVal(context, element, controller: MeshSettingsController) {
        return controller.meshView.getScale();
    },

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    },

    blur(context, element, controller: MeshSettingsController) {
        let scale = controller.meshView.getScale();
        try {
            context.releaseTempVal(val => scale = parseFloat(val));
        } catch (e) {
            console.log(e);
        }
        controller.meshView.setScale(scale);
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

const YPosControl: PropControl<string> = {
    defaultVal(context, element, controller: MeshSettingsController) {
        return controller.meshView.yPos.toString();
    },

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    },

    blur(context, element, controller: MeshSettingsController) {
        let yPos = controller.meshView.yPos;
        try {
            context.releaseTempVal(val => parseFloat(val))
        } catch(e) {
            console.log(e);
        }

        controller.meshView.yPos = yPos;
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

const TextureControl: PropControl<string> = {
    defaultVal(context, element, controller: MeshSettingsController) {
        if (controller.meshView.obj.textureId) {
            const assetObj = context.registry.stores.assetStore.getAssetById(controller.meshView.obj.textureId);
            return assetObj.path
        }

        return '';
    },

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    },

    async blur(context, element, controller: MeshSettingsController) {
        const val = context.getTempVal();
        context.clearTempVal();

        const asset = new AssetObj({path: val, assetType: AssetType.Texture});
        controller.meshView.obj.textureId = context.registry.stores.assetStore.addObj(asset);
        context.registry.services.localStore.saveAsset(asset);

        context.registry.engine.meshes.createMaterial(controller.meshView.obj);
        context.registry.services.history.createSnapshot();
    }
}

const ThumbnailControl: PropControl<any> = {
    click(context) {
        context.registry.plugins.activatePlugin(ThumbnailDialogPluginId);
    }
}

const ModelControl: PropControl<string> = {
    defaultVal(context, element, controller: MeshSettingsController) {
        if (controller.meshView.obj.modelId) {
            const assetObj = context.registry.stores.assetStore.getAssetById(controller.meshView.obj.modelId);
            return assetObj.path
        }

        return '';
    },

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    },

    async blur(context, element, controller: MeshSettingsController) {
        const val = context.getTempVal();
        context.clearTempVal();

        const asset = new AssetObj({path: val, assetType: AssetType.Model});
        controller.meshView.obj.modelId = context.registry.stores.assetStore.addObj(asset);
        context.registry.services.localStore.saveAsset(asset);
        context.registry.engine.meshes.deleteInstance(controller.meshView.obj);
        await context.registry.engine.meshes.createInstance(controller.meshView.obj)
        const realDimensions = context.registry.engine.meshes.getDimensions(controller.meshView.obj)
        controller.meshView.dimensions.setWidth(realDimensions.x);
        controller.meshView.dimensions.setHeight(realDimensions.y);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRenderAll();
    }
}