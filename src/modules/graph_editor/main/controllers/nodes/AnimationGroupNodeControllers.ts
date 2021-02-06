import { InputParamType, ParamController } from "../../../../../core/controller/FormController";
import { UIController } from "../../../../../core/controller/UIController";
import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { UI_Region } from "../../../../../core/models/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { AnimationGroupNodeParams } from "../../models/nodes/AnimationGroupNode";
import { MeshController } from "./MeshNodeControllers";

export class AnimationGroupNodeControllers extends UIController {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();
        this.mesh = new MeshController(registry, nodeObj);
        this.animation = new AnimationController(registry, nodeObj);
    }

    readonly mesh: MeshController;
    readonly animation: AnimationController;
}

export class AnimationController extends ParamController<string> {
    paramType = InputParamType.List;
    private nodeObj: NodeObj<AnimationGroupNodeParams>;

    constructor(registry: Registry, nodeObj: NodeObj<AnimationGroupNodeParams>) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    values() {
        const meshObj = this.nodeObj.param.mesh.getPortOrOwnVal();
        if (meshObj) {
            return this.registry.engine.animatons.getAnimationGroups(meshObj);
        } else {
            return [];
        }
    }

    val() {
        return this.nodeObj.param.animation.ownVal;
    }

    change(val: string) {
        this.nodeObj.param.animation.ownVal = val;
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }
}