import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { ParamController } from "../../../../../core/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { getAllKeys } from "../../../../../core/services/input/KeyboardService";
import { MeshController } from "./MeshNodeControllers";
import { RotateNodeParams } from "../../models/nodes/RotateNode";
import { UIController } from "../../../../../core/controller/UIController";

export class RotateNodeControllers extends UIController {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();
        this.mesh = new MeshController(registry, nodeObj);
        this.rotate = new MeshRotateController(registry, nodeObj);
        this.key = new KeyControl(registry, nodeObj);
    }

    readonly mesh: MeshController;
    readonly rotate: MeshRotateController;
    readonly key: KeyControl;
}

export class MeshRotateController extends ParamController<string> {
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
        this.nodeObj.param.rotate.setVal(val);
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }
}

export class KeyControl extends ParamController {
    private nodeObj: NodeObj<RotateNodeParams>;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    values() {
        return getAllKeys();
    }

    val() {
        return this.nodeObj.param.key.val;
    }

    change(val) {
        this.nodeObj.param.key.setVal(val);
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }
}