import { NodeObj } from "../models/objs/NodeObj";
import { Registry } from "../Registry";


export class NodeService {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    executePort(nodeObj: NodeObj, port: string) {
        if (nodeObj.getPort(port).hasConnectedPort()) {
            nodeObj.getPort(port).getConnectedPort().getNodeObj().executor.execute();
        }
    }
}