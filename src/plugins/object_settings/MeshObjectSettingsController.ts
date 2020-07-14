import { toDegree, toRadian } from '../../core/geometry/utils/Measurements';
import { MeshView } from '../../core/models/views/MeshView';
import { Registry } from '../../core/Registry';
import { RenderTask } from '../../core/services/RenderServices';
import { AbstractController } from '../scene_editor/settings/AbstractController';

export enum MeshObjectSettingsProps {
    MeshId = 'MeshId',
    Layer = 'Layer',
    Rotation = 'Rotation',
    Scale = 'Scale',
    YPos = 'YPos'
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
                context.tempVal = val;
                this.registry.services.render.runImmediately(RenderTask.RenderSidebar);
            })
            .onBlur((context) => {
                let rotation = this.meshView.getRotation();
                try {
                    rotation = toRadian(parseFloat(context.tempVal));
                } catch (e) {
                    console.log(e);
                }
                context.tempVal = undefined;
                this.meshView.setRotation(rotation);
                this.registry.services.render.runImmediately(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);
            })
            .onGet((context) => {
                return context.tempVal ? context.tempVal : Math.round(toDegree(this.meshView.getRotation()));
            });

        this.createPropHandler<string>(MeshObjectSettingsProps.Scale)
            .onChange((val, context) => {
                context.tempVal = val;
                this.registry.services.render.runImmediately(RenderTask.RenderSidebar);
            })
            .onBlur((context) => {
                let rotation = this.meshView.getScale();
                try {
                    rotation = parseFloat(context.tempVal);
                } catch (e) {
                    console.log(e);
                }
                context.tempVal = undefined;
                this.meshView.setScale(rotation);
                this.registry.services.render.runImmediately(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);
            })
            .onGet((context) => {
                return context.tempVal ? context.tempVal : Math.round(this.meshView.getScale());
            });

        this.createPropHandler<string>(MeshObjectSettingsProps.YPos)
            .onChange((val, context) => {
                context.tempVal = val;
                this.registry.services.render.runImmediately(RenderTask.RenderSidebar);
            })
            .onBlur((context) => {
                let yPos = this.meshView.yPos;
                try {
                    yPos = parseFloat(context.tempVal);
                } catch(e) {
                    console.log(e);
                }

                context.tempVal = undefined;
                this.meshView.yPos = yPos;
                this.registry.services.render.runImmediately(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);
            })
            .onGet((context) => {
                return context.tempVal ? context.tempVal : this.meshView.yPos;
            });
    }
}