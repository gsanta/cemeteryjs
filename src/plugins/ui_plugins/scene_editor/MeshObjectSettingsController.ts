import { toDegree, toRadian } from '../../../utils/geometry/Measurements';
import { MeshView } from '../../../core/models/views/MeshView';
import { Registry } from '../../../core/Registry';
import { AbstractController, PropControl } from '../../../core/plugins/controllers/AbstractController';
import { ThumbnailDialogPluginId } from './ThumbnailDialogPlugin';
import { AssetObj, AssetType } from '../../../core/models/game_objects/AssetObj';
import { ObjectSettingsPlugin } from './ObjectSettingsPlugin';
import { UI_Region } from '../../../core/plugins/UI_Plugin';

export enum MeshObjectSettingsProps {
    MeshId = 'MeshId',
    Layer = 'Layer',
    Rotation = 'Rotation',
    Scale = 'Scale',
    YPos = 'YPos',
    Model = 'Model',
    Texture = 'Texture',
    Thumbnail = 'Thumbnail'
}

export const MeshObjectSettingsControllerId = 'mesh-object-settings-controller';

export class MeshObjectSettingsController extends AbstractController<MeshObjectSettingsProps> {
    id = MeshObjectSettingsControllerId;
    // TODO user context instead of tempval
    tempVal: any;
    meshView: MeshView;

    constructor(plugin: ObjectSettingsPlugin,registry: Registry) {
        super(plugin, registry);
        this.plugin = plugin;

        this.registerPropControl(MeshObjectSettingsProps.MeshId, IdControl)
        this.registerPropControl(MeshObjectSettingsProps.Layer, LayerControl);
        this.registerPropControl(MeshObjectSettingsProps.Rotation, RotationControl);
        this.registerPropControl(MeshObjectSettingsProps.Scale, ScaleControl);
        this.registerPropControl(MeshObjectSettingsProps.YPos, YPosControl);
        this.registerPropControl(MeshObjectSettingsProps.Model, ModelControl);
        this.registerPropControl(MeshObjectSettingsProps.Texture, TextureControl);
        this.registerPropControl(MeshObjectSettingsProps.Thumbnail, ThumbnailControl);
    }
}

const IdControl: PropControl<string> = {
    defaultVal(context, element, controller: MeshObjectSettingsController) {
        return (<MeshView> context.registry.stores.selectionStore.getView()).id;
    },
    
    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    },

    blur(context, element, controller: MeshObjectSettingsController) {
        context.releaseTempVal((val) => (<MeshView> context.registry.stores.selectionStore.getView()).id = val);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }    
}

const LayerControl: PropControl<number> = {
    defaultVal(context, element, controller: MeshObjectSettingsController) {
        return controller.meshView.layer;
    },

    change(val, context, element, controller: MeshObjectSettingsController) {
        controller.meshView.layer = val;
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

const RotationControl: PropControl<string> = {
    defaultVal(context, element, controller: MeshObjectSettingsController) {
        return Math.round(toDegree(controller.meshView.getRotation())).toString();
    },
    
    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    },

    blur(context, element, controller: MeshObjectSettingsController) {
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
    defaultVal(context, element, controller: MeshObjectSettingsController) {
        return Math.round(controller.meshView.getScale()).toString();
    },

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    },

    blur(context, element, controller: MeshObjectSettingsController) {
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
    defaultVal(context, element, controller: MeshObjectSettingsController) {
        return controller.meshView.yPos.toString();
    },

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    },

    blur(context, element, controller: MeshObjectSettingsController) {
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

const TextureControl: PropControl<{data: string}> = {
    change(val, context, element, controller: MeshObjectSettingsController) {
        const asset = new AssetObj({data: val.data, assetType: AssetType.Texture});
        controller.meshView.obj.textureId = context.registry.stores.assetStore.addObj(asset);
        context.registry.services.localStore.saveAsset(asset);

        context.registry.engine.meshLoader.createMaterial(controller.meshView.obj);
        context.registry.services.history.createSnapshot();
    }
}

const ThumbnailControl: PropControl<any> = {
    click(context) {
        context.registry.plugins.activatePlugin(ThumbnailDialogPluginId);
    }
}

const ModelControl: PropControl<{data: string}> = {
    async change(val, context, element, controller: MeshObjectSettingsController) {
        const asset = new AssetObj({data: val.data, assetType: AssetType.Model});
        controller.meshView.obj.modelId = context.registry.stores.assetStore.addObj(asset);
        context.registry.services.localStore.saveAsset(asset);
        context.registry.engine.meshes.deleteInstance(controller.meshView.obj);
        await context.registry.engine.meshes.createInstance(controller.meshView.obj);
        const realDimensions = context.registry.engine.meshes.getDimensions(controller.meshView.obj)
        controller.meshView.dimensions.setWidth(realDimensions.x);
        controller.meshView.dimensions.setHeight(realDimensions.y);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRenderAll();
    }
}