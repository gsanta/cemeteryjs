import { Registry } from '../../core/Registry';
import { AbstractController } from '../scene_editor/settings/AbstractController';
import { MeshView } from '../../core/models/views/MeshView';
import { RenderTask } from '../../core/services/RenderServices';


export enum MeshObjectSettingsProps {
    MeshId = 'MeshId',
    Layer = 'Layer'
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
    }
}