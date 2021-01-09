import { UIController } from "../../../../../core/controller/UIController";
import { NodeObj } from "../../../../../core/models/objs/node_obj/NodeObj";
import { Registry } from "../../../../../core/Registry";
import { MeshController } from "./MeshNodeControllers";

export class TriggerZoneNodeControllers extends UIController {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();
        this.mesh = new MeshController(registry, nodeObj);
    }

    readonly mesh: MeshController;
}