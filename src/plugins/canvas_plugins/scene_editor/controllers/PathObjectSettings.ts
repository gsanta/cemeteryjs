import { PathView } from '../../../../core/models/views/PathView';
import { PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from '../../../../core/plugin/UI_Plugin';

export enum PathSettingsProps {
    PathId = 'PathId',
}

export const PathSettingsControllerId = 'path-settings-controller';

export class PathIdController extends PropController<any> {

    constructor() {
        super(PathSettingsProps.PathId);
    }

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context) {
        context.releaseTempVal((val) => (<PathView> context.registry.stores.viewStore.getOneSelectedView()).id = val);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
    
    defaultVal(context) {
        return (<PathView> context.registry.stores.viewStore.getOneSelectedView()).id
    }
}