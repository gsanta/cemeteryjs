import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { ParamControllers, PropController } from "../../../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { MeshPropertyNodeParams } from "../../models/nodes/MeshPropertyNode";

export class MeshPropertyNodeControllers extends ParamControllers {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();

        this.visible = new MeshVisibilityController(registry, nodeObj);
    }

    readonly visible: MeshVisibilityController;
}

export class MeshVisibilityController extends PropController {
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