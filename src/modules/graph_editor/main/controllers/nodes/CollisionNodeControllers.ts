import { InputParamType, ParamController } from "../../../../../core/controller/FormController";
import { UIController } from "../../../../../core/controller/UIController";
import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { AnimationGroupNodeParams } from "../../models/nodes/AnimationGroupNode";
import { CollisionNodeParams } from "../../models/nodes/CollisionNode";
import { MeshController } from "./MeshNodeControllers";

export class CollisionNodeControllers extends UIController {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();
        this.collision = new CollisionController(registry, nodeObj);
    }

    readonly collision: CollisionController;
}

export class CollisionController extends ParamController {
    paramType = InputParamType.Checkbox;
    private nodeObj: NodeObj<CollisionNodeParams>;

    constructor(registry: Registry, nodeObj: NodeObj<CollisionNodeParams>) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    val() {
        return this.nodeObj.param.collision.ownVal;
    }

    change(val: boolean) {
        this.nodeObj.param.collision.ownVal = val;

        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }

}