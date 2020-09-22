import { PathView } from '../../../../core/models/views/PathView';
import { AbstractController } from '../../../../core/plugin/controller/AbstractController';
import { UI_Plugin, UI_Region } from '../../../../core/plugin/UI_Plugin';
import { Registry } from '../../../../core/Registry';

export enum PathSettingsProps {
    PathId = 'PathId',
}

export const PathSettingsControllerId = 'path-settings-controller';
export class PathSettingsController extends AbstractController<PathSettingsProps> {
    id = PathSettingsControllerId;
    pathView: PathView;

    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler<string>(PathSettingsProps.PathId)
            .onChange((val, context) => {
                context.updateTempVal(val);
                this.registry.services.render.reRender(UI_Region.Sidepanel);
            })
            .onBlur((context) => {
                context.releaseTempVal((val) => (<PathView> this.registry.stores.canvasStore.getOneSelectedView()).id = val);
                this.registry.services.history.createSnapshot();
                this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
            })
            .onGet((context) => (<PathView> this.registry.stores.canvasStore.getOneSelectedView()).id);
    }
}