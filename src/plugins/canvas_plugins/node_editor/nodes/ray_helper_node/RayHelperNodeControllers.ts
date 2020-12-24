import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { ParamControllers, PropController } from "../../../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { RayHelperNodeParams } from "./RayHelperNode";

export class RayHelperNodeControllers extends ParamControllers {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();

        this.remove = new RemoveTimerController(registry, nodeObj);
    }

    readonly remove: RemoveTimerController;
}

export class RemoveTimerController extends PropController<string> {
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
        } finally {
            this.registry.services.render.reRenderAll();
        }
    }
}