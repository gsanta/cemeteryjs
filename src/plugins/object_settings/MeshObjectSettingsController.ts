import { toDegree, toRadian } from '../../core/geometry/utils/Measurements';
import { MeshView } from '../../core/models/views/MeshView';
import { Registry } from '../../core/Registry';
import { RenderTask } from '../../core/services/RenderServices';
import { AbstractController } from '../scene_editor/settings/AbstractController';
import { ThumbnailManagerDialogPluginId } from './ThumbnailManagerDialogPlugin';

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

export class MeshObjectSettingsController extends AbstractController<MeshObjectSettingsProps> {
    private tempVal: any;
    meshView: MeshView;

    constructor(registry: Registry) {
        super(registry);

        this.createPropHandler<number>(MeshObjectSettingsProps.MeshId)
            .onChange((val, context) => {
                this.tempVal = val;
                this.registry.services.render.runImmediately(RenderTask.RenderSidebar);
            })
            .onBlur((context) => {
                (<MeshView> this.registry.stores.selectionStore.getView()).id = this.tempVal;
                this.tempVal = undefined;
                this.registry.services.history.createSnapshot();
                this.registry.services.render.runImmediately(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);
            })
            .onGet((context) => {
                return this.tempVal || (<MeshView> this.registry.stores.selectionStore.getView()).id;
            });

        this.createPropHandler<number>(MeshObjectSettingsProps.Layer)
            .onChange((val, context) => {
                this.meshView.layer = val;
                this.registry.services.render.runImmediately(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);
            })
            .onGet((context) => {
                return this.meshView.layer;
            });

        this.createPropHandler<string>(MeshObjectSettingsProps.Rotation)
            .onChange((val, context) => {
                context.updateTempVal(val);
                this.registry.services.render.runImmediately(RenderTask.RenderSidebar);
            })
            .onBlur((context) => {
                let rotation = this.meshView.getRotation();
                try {
                    context.releaseTempVal((val) => rotation = toRadian(parseFloat(val)))
                } catch (e) {
                    console.log(e);
                }
                this.meshView.setRotation(rotation);
                this.registry.services.render.runImmediately(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);
            })
            .onGet((context) => {
                return context.getTempVal(() => Math.round(toDegree(this.meshView.getRotation())).toString());
            });

        this.createPropHandler<string>(MeshObjectSettingsProps.Scale)
            .onChange((val, context) => {
                context.updateTempVal(val);
                this.registry.services.render.runImmediately(RenderTask.RenderSidebar);
            })
            .onBlur((context) => {
                let rotation = this.meshView.getScale();
                try {
                    context.releaseTempVal(val => rotation = parseFloat(val));
                } catch (e) {
                    console.log(e);
                }
                this.meshView.setScale(rotation);
                this.registry.services.render.runImmediately(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);
            })
            .onGet((context) => {
                return context.getTempVal(() => Math.round(this.meshView.getScale()).toString());
            });

        this.createPropHandler<string>(MeshObjectSettingsProps.YPos)
            .onChange((val, context) => {
                context.updateTempVal(val);
                this.registry.services.render.runImmediately(RenderTask.RenderSidebar);
            })
            .onBlur((context) => {
                let yPos = this.meshView.yPos;
                try {
                    context.releaseTempVal(val => parseFloat(val))
                } catch(e) {
                    console.log(e);
                }

                this.meshView.yPos = yPos;
                this.registry.services.render.runImmediately(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);
            })
            .onGet((context) => {
                return context.getTempVal(() => this.meshView.yPos.toString());
            });

        this.createPropHandler<number>(MeshObjectSettingsProps.Model)
            .onClick((val) => {
            });

        this.createPropHandler<number>(MeshObjectSettingsProps.Texture)
            .onClick((val) => {
            });

        this.createPropHandler<number>(MeshObjectSettingsProps.Thumbnail)
            .onClick((val) => {
                this.registry.services.plugin.showPlugin(ThumbnailManagerDialogPluginId);
            });
    }
}