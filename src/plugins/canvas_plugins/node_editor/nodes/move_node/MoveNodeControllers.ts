import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { ParamControllers, PropController } from "../../../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { MeshController } from "../mesh_node/MeshNodeControllers";
import { MoveDirection, MoveNodeParams } from "./MoveNode";

export class MoveNodeControllers extends ParamControllers {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();
        this.mesh = new MeshController(registry, nodeObj);
        this.move = new MeshMoveController(registry, nodeObj);
        this.speed = new MeshSpeedController(registry, nodeObj);
    }

    readonly mesh: MeshController;
    readonly move: MeshMoveController;
    readonly speed: MeshSpeedController;
}

export class MeshMoveController extends PropController<string> {
    private nodeObj: NodeObj<MoveNodeParams>;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    values() {
        return [MoveDirection.Forward, MoveDirection.Backward, MoveDirection.Left, MoveDirection.Right];
    }

    val() {
        return this.nodeObj.param.move.val;
    }

    change(val) {
        this.nodeObj.param.move.val = val;
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class MeshSpeedController extends PropController<string> {
    private nodeObj: NodeObj<MoveNodeParams>;
    private tempVal: string;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    val() {
        return this.tempVal !== undefined ? this.tempVal : this.nodeObj.param.speed.val;
    }

    change(val) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }

    blur() {
        try {
            this.nodeObj.param.speed.val = parseFloat(this.tempVal);
            this.tempVal = undefined;
            this.registry.services.history.createSnapshot();
        } finally {
            this.registry.services.render.reRenderAll();
        }
    }
} 