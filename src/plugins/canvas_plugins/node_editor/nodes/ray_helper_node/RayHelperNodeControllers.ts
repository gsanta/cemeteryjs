import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { ParamControllers, PropContext, PropController } from "../../../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { RayHelperNodeParams } from "./RayHelperNode";

export class RayHelperNodeControllers extends ParamControllers {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();
    }
}

export class RemoveTimerController extends PropController<string> {
    private nodeObj: NodeObj<RayHelperNodeParams>;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    acceptedProps() { return ['remove']; }

    defaultVal() {
        return this.nodeObj.param.remove.val;
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }

    blur(context: PropContext) {
        this.nodeObj.param.remove.val = context.clearTempVal();
        context.registry.services.render.reRenderAll();
    }
}