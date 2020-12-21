import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { ParamControllers, PropContext, PropController } from "../../../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { MeshController } from "../MeshNode";
import { MoveNodeParams } from "./MoveNode";

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

    acceptedProps() { return ['move']; }

    values() {
        return ['forward', 'backward'];
    }

    val() {
        return this.nodeObj.param.move.val;
    }

    change(val) {
        this.nodeObj.param.move.val = val;
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class MeshSpeedController extends PropController<string> {
    private nodeObj: NodeObj<MoveNodeParams>;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    acceptedProps() { return ['speed']; }

    defaultVal() {
        return this.nodeObj.param.speed.val;
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }

    blur(context: PropContext) {
        this.nodeObj.setParam = context.clearTempVal();
        context.registry.services.render.reRenderAll();
    }
}