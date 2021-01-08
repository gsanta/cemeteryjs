import { NodeObj } from "../../../../core/models/objs/node_obj/NodeObj";
import { NodeView } from "../views/NodeView";


export abstract class AbstractNodeFactory {
    nodeType: string;
    displayName: string;
    category: string;
    abstract createView(obj: NodeObj): NodeView;
    abstract createObj(): NodeObj;
}