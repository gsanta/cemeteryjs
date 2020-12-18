import { NodeConnectionObj } from "../../models/objs/NodeConnectionObj";
import { NodeObj, NodeParams } from "../../models/objs/node_obj/NodeObj";

export abstract class AbstractNodeExecutor<P extends NodeParams> {
    protected nodeObj: NodeObj<P>;

    constructor(nodeObj: NodeObj) {
        this.nodeObj = nodeObj;
    }

    abstract execute();
    
    executeStop() {}
    executeStart() {}

    onConnect(connection: NodeConnectionObj) {}
    onDisconnect?(connection: NodeConnectionObj) {}
}