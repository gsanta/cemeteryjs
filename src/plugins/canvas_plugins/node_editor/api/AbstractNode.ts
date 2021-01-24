import { NodeObj } from "../../../../core/models/objs/node_obj/NodeObj";
import { NodeShape } from "../models/shapes/NodeShape";


export abstract class AbstractNodeFactory {
    nodeType: string;
    displayName: string;
    category: string;
    abstract createView(obj: NodeObj): NodeShape;
    abstract createObj(): NodeObj;
}