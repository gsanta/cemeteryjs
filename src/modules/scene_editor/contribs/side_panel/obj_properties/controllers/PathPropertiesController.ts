import { ParamController } from '../../../../../../core/controller/FormController';
import { PathObj } from '../../../../../../core/models/objs/PathObj';
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
        const pathObj = <PathObj> this.registry.data.scene.items.getByTag('select')[0];

        context.releaseTempVal((val) => pathObj.id = val);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
    
    defaultVal() {
        const pathObj = <PathObj> this.registry.data.scene.items.getByTag('select')[0];
        return pathObj.id;
    }
}