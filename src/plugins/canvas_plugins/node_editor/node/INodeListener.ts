import { NodeObj } from "../../../../core/models/objs/node_obj/NodeObj";
import { Registry } from "../../../../core/Registry";

export interface INodeListener {
    onBeforeRender?(nodeObj: NodeObj, registry: Registry): void;
}