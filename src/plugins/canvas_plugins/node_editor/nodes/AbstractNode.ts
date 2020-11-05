import { NodeParam } from "../../../../core/models/objs/NodeObj";
import { View } from "../../../../core/models/views/View";


export abstract class AbstractNode {
    abstract getParams(): NodeParam[];
}