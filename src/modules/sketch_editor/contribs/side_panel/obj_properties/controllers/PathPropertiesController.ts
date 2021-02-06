import { PathShape } from '../../../../main/models/shapes/PathShape';
import { ParamController } from '../../../../../../core/controller/FormController';
import { UI_Region } from '../../../../../../core/models/UI_Panel';

export enum PathViewControllerParam {
    PathId = 'PathId',
}

export const PathPropertiesControllerId = 'path-properties-controller';

export class PathIdController extends ParamController<any> {
    acceptedProps() { return [PathViewControllerParam.PathId]; }

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context) {
        const pathShape = <PathShape> this.registry.data.sketch.selection.getAllItems()[0];

        context.releaseTempVal((val) => pathShape.id = val);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
    
    defaultVal(context) {
        const pathShape = <PathShape> this.registry.data.sketch.selection.getAllItems()[0];
        return pathShape.id;
    }
}