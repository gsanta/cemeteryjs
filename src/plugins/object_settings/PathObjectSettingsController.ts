import { toDegree, toRadian } from '../../core/geometry/utils/Measurements';
import { MeshView } from '../../core/models/views/MeshView';
import { Registry } from '../../core/Registry';
import { RenderTask } from '../../core/services/RenderServices';
import { AbstractController } from '../scene_editor/settings/AbstractController';
import { PathView } from '../../core/models/views/PathView';

export enum PathObjectSettingsProps {
    PathId = 'PathId',
}

export class PathObjectSettingsController extends AbstractController<PathObjectSettingsProps> {
    pathView: PathView;

    constructor(registry: Registry) {
        super(registry);

        this.createPropHandler<string>(PathObjectSettingsProps.PathId)
            .onChange((val, context) => {
                context.updateTempVal(val);
                this.registry.services.render.runImmediately(RenderTask.RenderSidebar);
            })
            .onBlur((context) => {
                context.releaseTempVal((val) => (<PathView> this.registry.stores.selectionStore.getView()).id = val);
                this.registry.services.history.createSnapshot();
                this.registry.services.render.runImmediately(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);
            })
            .onGet((context) => {
                return context.getTempVal(() => (<PathView> this.registry.stores.selectionStore.getView()).id);
            });
    }
}