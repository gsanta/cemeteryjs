import { Registry } from '../../core/Registry';
import { AbstractController } from '../scene_editor/settings/AbstractController';
import { MeshView } from '../../core/models/views/MeshView';
import { RenderTask } from '../../core/services/RenderServices';
import { toRadian, toDegree } from '../../core/geometry/utils/Measurements';


export enum MeshObjectSettingsProps {
    MeshId = 'MeshId',
    Layer = 'Layer',
    Rotation = 'Rotation',
    Scale = 'Scale',
}

export class MeshObjectSettingsController extends AbstractController<MeshObjectSettingsProps> {
    private tempVal: any;
    meshView: MeshView;

    constructor(registry: Registry) {
        super(registry);

        this.addPropHandlers(
            MeshObjectSettingsProps.MeshId,
            {
                onChange: (val) => {
                    this.tempVal = val;
                    this.registry.services.render.runImmediately(RenderTask.RenderSidebar);
                },
                onBlur: () => {
                    (<MeshView> this.registry.stores.selectionStore.getView()).id = this.tempVal;
                    this.tempVal = undefined;
                    this.registry.services.history.createSnapshot();
                    this.registry.services.render.runImmediately(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);
                },
                onGet: () => {
                    return this.tempVal || (<MeshView> this.registry.stores.selectionStore.getView()).id;
                }
            }
        );

        this.addPropHandlers(
            MeshObjectSettingsProps.Layer,
            {
                onChange: (val) => {
                    this.meshView.layer = val;
                    this.registry.services.render.runImmediately(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);
                },
                onGet: () => {
                    return this.meshView.layer;
                }
            }
        );

        this.addPropHandlers(
            MeshObjectSettingsProps.Rotation,
            {
                onChange: (val, context) => {
                    context.tempVal = val;
                    this.registry.services.render.runImmediately(RenderTask.RenderSidebar);
                },
                onBlur: (context) => {
                    let rotation = this.meshView.getRotation();
                    try {
                        rotation = toRadian(parseFloat(context.tempVal));
                    } catch (e) {
                        console.log(e);
                    }
                    context.tempVal = undefined;
                    this.meshView.setRotation(rotation);
                    this.registry.services.render.runImmediately(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);
                },
                onGet: (context) => {
                    return context.tempVal ? context.tempVal : Math.round(toDegree(this.meshView.getRotation()));
                }
            }
        );

        this.addPropHandlers(
            MeshObjectSettingsProps.Scale,
            {
                onChange: (val, context) => {
                    context.tempVal = val;
                    this.registry.services.render.runImmediately(RenderTask.RenderSidebar);
                },
                onBlur: (context) => {
                    let rotation = this.meshView.getScale();
                    try {
                        rotation = toRadian(parseFloat(context.tempVal));
                    } catch (e) {
                        console.log(e);
                    }
                    context.tempVal = undefined;
                    this.meshView.setScale(rotation);
                    this.registry.services.render.runImmediately(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);
                },
                onGet: (context) => {
                    return context.tempVal ? context.tempVal : Math.round(toDegree(this.meshView.getScale()));
                }
            }
        );

        this.createPropHandler(MeshObjectSettingsProps.Scale)
            .onChange()
    }
}