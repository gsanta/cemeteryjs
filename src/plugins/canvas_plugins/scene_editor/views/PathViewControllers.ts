import { PathView } from './PathView';
import { ParamControllers, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from '../../../../core/plugin/UI_Panel';
import { Registry } from '../../../../core/Registry';

export class PathViewControllers extends ParamControllers {
    constructor(registry: Registry) {
        super();

        this.pathId = new PathIdController(registry);
    }

    pathId: PathIdController;
}


export class PathIdController extends PropController {
    private tempVal: string;
    change(val) {
        this.val = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        (<PathView> this.registry.data.view.scene.getOneSelectedView()).id = this.tempVal;
        this.tempVal = undefined;
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
    
    val() {
        return (<PathView> this.registry.data.view.scene.getOneSelectedView()).id;
    }
}