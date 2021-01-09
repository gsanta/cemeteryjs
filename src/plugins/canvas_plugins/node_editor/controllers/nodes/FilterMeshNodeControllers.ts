import { UIController } from "../../../../../core/controller/UIController";
import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { Registry } from "../../../../../core/Registry";
import { MultiMeshController } from "./MeshNodeControllers";

export class FilterMeshNodeControllers extends UIController {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();
        this.mesh = new MultiMeshController(registry, nodeObj);
    }

    readonly mesh: MultiMeshController;
}