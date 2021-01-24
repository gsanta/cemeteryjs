import { PathShape } from '../../../canvas_plugins/scene_editor/models/shapes/PathShape';
import { ParamController } from '../../../../core/controller/FormController';
import { UI_Region } from '../../../../core/plugin/UI_Panel';

export enum PathViewControllerParam {
    PathId = 'PathId',
}

export const PathSettingsControllerId = 'path-settings-controller';

export class PathIdController extends ParamController<any> {
    acceptedProps() { return [PathViewControllerParam.PathId]; }

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context) {
        context.releaseTempVal((val) => (<PathShape> context.registry.stores.views.getOneSelectedView()).id = val);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
    
    defaultVal(context) {
        return (<PathShape> context.registry.stores.views.getOneSelectedView()).id
    }
}