import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { ParamController } from "../../../../../core/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { MeshPropertyNodeParams } from "../../models/nodes/MeshPropertyNode";
import { UIController } from "../../../../../core/controller/UIController";

export class MeshPropertyNodeControllers extends UIController {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();

        this.visible = new MeshVisibilityController(registry, nodeObj);
    }

    readonly visible: MeshVisibilityController;
}

export class MeshVisibilityController extends ParamController {
    private nodeObj: NodeObj<MeshPropertyNodeParams>;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    val() {
        return this.nodeObj.param.visible.val;
    }

    change(val: string) {
        try {
            this.nodeObj.param.visible.val = parseFloat(val);

        } finally {
            this.registry.services.history.createSnapshot();
            this.registry.services.render.reRender(UI_Region.Canvas1);
        }
    }
}