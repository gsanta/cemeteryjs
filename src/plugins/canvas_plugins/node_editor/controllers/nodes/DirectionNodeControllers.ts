import { InputParamType, ParamController } from "../../../../../core/controller/FormController";
import { UIController } from "../../../../../core/controller/UIController";
import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { DirectionNodeParams } from "../../models/nodes/DirectionNode";
import { MoveDirection } from "../../models/nodes/MoveNode";


export class DirectionNodeControllers extends UIController {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();
        this.direction = new DirectionController(registry, nodeObj);
    }

    readonly direction: DirectionController;
}


export class DirectionController extends ParamController<string> {
    paramType = InputParamType.List;
    private nodeObj: NodeObj<DirectionNodeParams>;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    values() {
        return [MoveDirection.Forward, MoveDirection.Backward, MoveDirection.Left, MoveDirection.Right];
    }

    val() {
        return this.nodeObj.param.direction.ownVal;
    }

    change(val) {
        this.nodeObj.param.direction.setVal(val);
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }
}
