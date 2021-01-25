import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { InputParamType, ParamController } from "../../../../../core/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { getAllKeys } from "../../../../../core/services/input/KeyboardService";
import { MeshController } from "./MeshNodeControllers";
import { RotateNodeParams } from "../../models/nodes/RotateNode";
import { UIController } from "../../../../../core/controller/UIController";
import { MoveDirection } from "../../models/nodes/MoveNode";

export class RotateNodeControllers extends UIController {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();
        this.mesh = new MeshController(registry, nodeObj);
        this.direction = new DirectionController(registry, nodeObj);
        this.key = new KeyControl(registry, nodeObj);
    }

    readonly mesh: MeshController;
    readonly direction: DirectionController;
    readonly key: KeyControl;
}

export class DirectionController extends ParamController<string> {
    paramType = InputParamType.List;
    private nodeObj: NodeObj<RotateNodeParams>;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    values() {
        return [MoveDirection.Left, MoveDirection.Right];
    }

    val() {
        if (this.nodeObj.param.direction.ownVal.length > 0) {
            return this.nodeObj.param.direction.ownVal[0];
        }
    }

    change(val) {
        this.nodeObj.param.direction.ownVal = [val];
        this.nodeObj.listener.onNodeParamChange(this.nodeObj.param.direction);
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class KeyControl extends ParamController {
    paramType = InputParamType.List;
    private nodeObj: NodeObj<RotateNodeParams>;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    values() {
        return getAllKeys();
    }

    val() {
        return this.nodeObj.param.key.ownVal;
    }

    change(val) {
        this.nodeObj.param.key.ownVal = val;
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }
}