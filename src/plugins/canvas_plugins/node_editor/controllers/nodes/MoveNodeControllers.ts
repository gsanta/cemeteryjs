import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { InputParamType, ParamController } from "../../../../../core/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { getAllKeys } from "../../../../../core/services/input/KeyboardService";
import { MeshController } from "./MeshNodeControllers";
import { MoveDirection, MoveNodeParams } from "../../models/nodes/MoveNode";
import { UIController } from "../../../../../core/controller/UIController";

export class MoveNodeControllers extends UIController {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();
        this.mesh = new MeshController(registry, nodeObj);
        this.direction = new MoveDirectionController(registry, nodeObj);
        this.speed = new MeshSpeedController(registry, nodeObj);
        this.key = new KeyControl(registry, nodeObj);
    }

    readonly mesh: MeshController;
    readonly direction: MoveDirectionController;
    readonly speed: MeshSpeedController;
    readonly key: KeyControl;
}

export class MoveDirectionController extends ParamController<string> {
    paramType = InputParamType.List;
    private nodeObj: NodeObj<MoveNodeParams>;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    values() {
        return [MoveDirection.Forward, MoveDirection.Backward, MoveDirection.Left, MoveDirection.Right];
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

export class MeshSpeedController extends ParamController<string> {
    paramType = InputParamType.NumberField;
    private nodeObj: NodeObj<MoveNodeParams>;
    private tempVal: string;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    val() {
        return this.tempVal !== undefined ? this.tempVal : this.nodeObj.param.speed.ownVal.toString();
    }

    change(val) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }

    blur() {
        try {
            this.nodeObj.param.speed.setVal(parseFloat(this.tempVal));
            this.tempVal = undefined;
            this.registry.services.history.createSnapshot();
        } finally {
            this.registry.services.render.reRenderAll();
        }
    }
}

export class KeyControl extends ParamController {
    paramType = InputParamType.List;
    private nodeObj: NodeObj<MoveNodeParams>;

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
        this.nodeObj.param.key.setVal(val);
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }
}