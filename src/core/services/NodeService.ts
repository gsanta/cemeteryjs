import { NodeObj, NodeParam } from "../models/objs/NodeObj";
import { Registry } from "../Registry";


export class NodeService {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    executePort(nodeObj: NodeObj, port: string) {
        const connection = nodeObj.getConnection(port);
        if (connection) {
            connection[0].executor.execute();
        }
    }

    pullData(nodeObj: NodeObj, port: string): any {
        // TODO check that port is input port
        const connection = nodeObj.getConnection(port);
        if (connection) {
            return connection[0].param[connection[1]].val;
        }
    }
}