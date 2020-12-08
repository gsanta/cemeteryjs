import { NodeObj } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";


export abstract class AbstractNodeFactory {
    nodeType: string;
    displayName: string;
    category: string;
    abstract createView(obj: NodeObj): NodeView;
    abstract createObj(): NodeObj;
}