import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { ParamControllers } from "../../../../../core/plugin/controller/FormController";
import { Registry } from "../../../../../core/Registry";
import { MeshController } from "./MeshNodeControllers";

export class RemoveMeshNodeControllers extends ParamControllers {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();
        this.mesh = new MeshController(registry, nodeObj);
    }

    readonly mesh: MeshController;
}