import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { ParamController } from "../../../../../core/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { RayHelperNodeParams } from "../../models/nodes/RayHelperNode";
import { UIController } from "../../../../../core/controller/UIController";

export class RayHelperNodeControllers extends UIController {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();

        this.remove = new RemoveTimerController(registry, nodeObj);
    }

    readonly remove: RemoveTimerController;
}

export class RemoveTimerController extends ParamController<string> {
    private nodeObj: NodeObj<RayHelperNodeParams>;
    private tempVal: string;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    val() {
        return this.tempVal !== undefined ? this.tempVal : this.nodeObj.param.remove.val;
    }

    change(val) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }

    blur() {
        try {
            this.nodeObj.param.remove.val = this.tempVal;
            this.tempVal = undefined;
            this.registry.services.history.createSnapshot();
        } finally {
            this.registry.services.render.reRenderAll();
        }
    }
}