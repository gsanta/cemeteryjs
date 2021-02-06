import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { InputParamType, ParamController } from "../../../../../core/controller/FormController";
import { UI_Region } from "../../../../../core/models/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { PathShapeType } from "../../../../sketch_editor/main/models/shapes/PathShape";
import { UIController } from "../../../../../core/controller/UIController";

export class PathNodeControllers extends UIController {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();

        this.path = new PathController(registry, nodeObj);
    }

    readonly path: PathController;
}

export class PathController extends ParamController<string> {
    paramType = InputParamType.List;
    private nodeObj: NodeObj;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    values() {
        return this.registry.data.sketch.items.getItemsByType(PathShapeType).map(pathView => pathView.id);
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