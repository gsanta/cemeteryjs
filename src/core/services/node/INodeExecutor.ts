import { NodeObj } from "../../models/objs/NodeObj";

export interface INodeExecutor {
    execute(nodeObj: NodeObj);
    executeStop?(nodeObj: NodeObj);
    executeStart?(nodeObj: NodeObj);
}