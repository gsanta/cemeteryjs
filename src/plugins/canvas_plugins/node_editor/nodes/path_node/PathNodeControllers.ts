import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { ParamControllers, PropController } from "../../../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { PathViewType } from "../../../scene_editor/views/PathView";

export class PathNodeControllers extends ParamControllers {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();

        this.path = new PathController(registry, nodeObj);
    }

    readonly path: PathController;
}

export class PathController extends PropController<string> {
    private nodeObj: NodeObj;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    values() {
        return this.registry.data.view.scene.getViewsByType(PathViewType).map(pathView => pathView.id);
    }

    val() {
        return this.nodeObj.param.path.val;
    }

    change(val) {
        try {
            this.nodeObj.param.path = val;
        } finally {
            this.registry.services.history.createSnapshot();
            this.registry.services.render.reRender(UI_Region.Canvas1);
        }
    }
}