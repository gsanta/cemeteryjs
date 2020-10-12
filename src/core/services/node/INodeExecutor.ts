import { NodeObj } from "../../models/objs/NodeObj";
import { Registry } from "../../Registry";


export interface INodeExecutor {
    execute(nodeObj: NodeObj, registry: Registry);
    executeStop?(nodeObj: NodeObj, regsitry: Registry);
    executeStart?(nodeObj: NodeObj, regsitry: Registry);
}