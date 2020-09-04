import { toDegree, toRadian } from '../../../utils/geometry/Measurements';
import { MeshView } from '../../../core/models/views/MeshView';
import { Registry } from '../../../core/Registry';
import { AbstractController } from '../../../core/plugins/controllers/AbstractController';
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
    private tempVal: any;
    meshView: MeshView;

    constructor(plugin: ObjectSettingsPlugin,registry: Registry) {
        super(plugin, registry);
        this.plugin = plugin;

        this.createPropHandler<number>(MeshObjectSettingsProps.MeshId)
            .onChange((val, context) => {
                this.tempVal = val;
                this.registry.services.render.reRender(UI_Region.Sidepanel);
            })
            .onBlur((context) => {
                (<MeshView> this.registry.stores.selectionStore.getView()).id = this.tempVal;
                this.tempVal = undefined;
                this.registry.services.history.createSnapshot();
                this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
            })
            .onGet((context) => {
                return this.tempVal || (<MeshView> this.registry.stores.selectionStore.getView()).id;
            });

        this.createPropHandler<number>(MeshObjectSettingsProps.Layer)
            .onChange((val, context) => {
                this.meshView.layer = val;
                this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
            })
            .onGet((context) => {
                return this.meshView.layer;
            });

        this.createPropHandler<string>(MeshObjectSettingsProps.Rotation)
            .onChange((val, context) => {
                context.updateTempVal(val);
                this.registry.services.render.reRender(UI_Region.Sidepanel);
            })
            .onBlur((context) => {
                let rotation = this.meshView.getRotation();
                try {
                    context.releaseTempVal((val) => rotation = toRadian(parseFloat(val)))
                } catch (e) {
                    console.log(e);
                }
                this.meshView.setRotation(rotation);
                this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
            })
            .onGet((context) => Math.round(toDegree(this.meshView.getRotation())).toString());

        this.createPropHandler<string>(MeshObjectSettingsProps.Scale)
            .onChange((val, context) => {
                context.updateTempVal(val);
                this.registry.services.render.reRender(UI_Region.Sidepanel);
            })
            .onBlur((context) => {
                let scale = this.meshView.getScale();
                try {
                    context.releaseTempVal(val => scale = parseFloat(val));
                } catch (e) {
                    console.log(e);
                }
                this.meshView.setScale(scale);
                this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
            })
            .onGet((context) => Math.round(this.meshView.getScale()).toString());

        this.createPropHandler<string>(MeshObjectSettingsProps.YPos)
            .onChange((val, context) => {
                context.updateTempVal(val);
                this.registry.services.render.reRender(UI_Region.Sidepanel);
            })
            .onBlur((context) => {
                let yPos = this.meshView.yPos;
                try {
                    context.releaseTempVal(val => parseFloat(val))
                } catch(e) {
                    console.log(e);
                }

                this.meshView.yPos = yPos;
                this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
            })
            .onGet((context) => this.meshView.yPos.toString());

        this.createPropHandler<{data: string}>(MeshObjectSettingsProps.Model)
            .onChange(async (val) => {
                const asset = new AssetObj({data: val.data, assetType: AssetType.Model});
                this.meshView.obj.modelId = this.registry.stores.assetStore.addObj(asset);
                this.registry.services.localStore.saveAsset(asset);
                this.registry.engine.meshes.deleteInstance(this.meshView.obj);
                await this.registry.engine.meshes.createInstance(this.meshView.obj);
                const realDimensions = this.registry.engine.meshes.getDimensions(this.meshView.obj)
                this.meshView.dimensions.setWidth(realDimensions.x);
                this.meshView.dimensions.setHeight(realDimensions.y);
                this.registry.services.history.createSnapshot();
                this.registry.services.render.reRenderAll();
            });

        this.createPropHandler<{data: string}>(MeshObjectSettingsProps.Texture)
            .onChange((val) => {
                const asset = new AssetObj({data: val.data, assetType: AssetType.Texture});
                this.meshView.obj.textureId = this.registry.stores.assetStore.addObj(asset);
                this.registry.services.localStore.saveAsset(asset);

                this.registry.engine.meshLoader.createMaterial(this.meshView.obj);
                this.registry.services.history.createSnapshot();
            })
            .onClick((val) => {
                1
            });

        this.createPropHandler<number>(MeshObjectSettingsProps.Thumbnail)
            .onClick((val) => {
                this.registry.plugins.activatePlugin(ThumbnailDialogPluginId);
            });
    }
}