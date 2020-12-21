import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { ParamControllers, PropController } from "../../../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { MeshController } from "../MeshNode";
import { RotateNodeParams } from "./RotateNode";

export class RotateNodeControllers extends ParamControllers {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();
        this.mesh = new MeshController(registry, nodeObj);
        this.rotate = new MeshRotateController(registry, nodeObj);
    }

    readonly mesh: MeshController;
    readonly rotate: MeshRotateController;
}

export class MeshRotateController extends PropController<string> {
    private nodeObj: NodeObj<RotateNodeParams>;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    values() {
        return ['left', 'right'];
    }

    val() {
        return this.nodeObj.param.rotate.val;
    }

    change(val) {
        this.nodeObj.param.rotate.val = val;
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }
}