import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { ParamControllers, PropController } from "../../../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { MeshController } from "../mesh_node/MeshNodeControllers";
import { AnimationGroupNodeParams } from "./AnimationGroupNode";

export class AnimationGroupNodeControllers extends ParamControllers {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();
        this.mesh = new MeshController(registry, nodeObj);
        this.animation = new AnimationController(registry, nodeObj);
    }

    readonly mesh: MeshController;
    readonly animation: AnimationController;
}

export class AnimationController extends PropController<string> {
    private nodeObj: NodeObj<AnimationGroupNodeParams>;

    constructor(registry: Registry, nodeObj: NodeObj<AnimationGroupNodeParams>) {
        super(registry);
        this.nodeObj = nodeObj;
    }

    values() {
        const meshObj = this.nodeObj.param.mesh.getData(this.nodeObj);
        if (meshObj) {
            return this.registry.engine.animatons.getAnimationGroups(meshObj);
        } else {
            return [];
        }
    }

    val() {
        return this.nodeObj.param.animation.val;
    }

    change(val: string) {
        this.nodeObj.param.animation.val = val;
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }
}