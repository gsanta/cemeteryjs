import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { ParamControllers, PropContext, PropController } from "../../../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { MeshController } from "../MeshNode";
import { RayCasterNodeParams } from "./RayCasterNode";

export class RayCasterNodeControllers extends ParamControllers {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();
        this.mesh = new MeshController(registry, nodeObj);
        this.length = new RayLengthController(registry, nodeObj);
    }

    readonly mesh: MeshController;
    readonly length: RayLengthController;
}

export class RayLengthController extends PropController<string> {
    private nodeObj: NodeObj<RayCasterNodeParams>;
    private tempVal: string;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    val() {
        return this.tempVal !== undefined ? this.tempVal : this.nodeObj.param.length.val;
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }

    blur() {
        this.nodeObj.param.length.val = this.tempVal;
        this.tempVal = undefined;
        this.registry.services.render.reRenderAll();
    }
}