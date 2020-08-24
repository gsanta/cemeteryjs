import { toDegree, toRadian } from '../../../utils/geometry/Measurements';
import { MeshView } from '../../../core/models/views/MeshView';
import { Registry } from '../../../core/Registry';
import { RenderTask } from '../../../core/services/RenderServices';
import { AbstractController } from '../../../core/plugins/controllers/AbstractController';
import { PathView } from '../../../core/models/views/PathView';
import { UI_Plugin, UI_Region } from '../../../core/plugins/UI_Plugin';

export enum PathObjectSettingsProps {
    PathId = 'PathId',
}

export const PathObjectSettingsControllerId = 'path-object-settings-controller';
export class PathObjectSettingsController extends AbstractController<PathObjectSettingsProps> {
    id = PathObjectSettingsControllerId;
    pathView: PathView;

    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler<string>(PathObjectSettingsProps.PathId)
            .onChange((val, context) => {
                context.updateTempVal(val);
                this.registry.services.render.reRender(UI_Region.Sidepanel);
            })
            .onBlur((context) => {
                context.releaseTempVal((val) => (<PathView> this.registry.stores.selectionStore.getView()).id = val);
                this.registry.services.history.createSnapshot();
                this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
            })
            .onGet((context) => (<PathView> this.registry.stores.selectionStore.getView()).id);
    }
}