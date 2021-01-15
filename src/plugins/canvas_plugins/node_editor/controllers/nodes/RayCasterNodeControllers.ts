import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { InputParamType, ParamController } from "../../../../../core/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { MeshController } from "./MeshNodeControllers";
import { RayCasterNodeParams } from "../../models/nodes/RayCasterNode";
import { UIController } from "../../../../../core/controller/UIController";

export class RayCasterNodeControllers extends UIController {
    constructor(registry: Registry, nodeObj: NodeObj) {
        super();
        this.mesh = new MeshController(registry, nodeObj);
        this.length = new RayLengthController(registry, nodeObj);
    }

    readonly mesh: MeshController;
    readonly length: RayLengthController;
}

export class RayLengthController extends ParamController<string> {
    paramType = InputParamType.NumberField;
    private nodeObj: NodeObj<RayCasterNodeParams>;
    private tempVal: string;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    val() {
        return this.tempVal !== undefined ? this.tempVal : this.nodeObj.param.length.ownVal;
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }

    blur() {
        try {
            this.nodeObj.param.length.ownVal = parseFloat(this.tempVal);
            this.tempVal = undefined;
        } finally {
            this.registry.services.render.reRenderAll();
        }
    }
}