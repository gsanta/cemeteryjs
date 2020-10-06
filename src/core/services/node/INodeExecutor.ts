import { NodeObj } from "../../models/objs/NodeObj";
import { Registry } from "../../Registry";


export interface INodeExecutor {
    execute(nodeObj: NodeObj, registry: Registry);
    stop(nodeObj: NodeObj, regsitry: Registry);
}