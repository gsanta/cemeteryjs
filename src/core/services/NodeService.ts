import { NodeObj } from "../models/objs/NodeObj";
import { Registry } from "../Registry";


export class NodeService {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    executePort(nodeObj: NodeObj, port: string) {
        if (nodeObj.getPort(port).hasConnectedPort()) {
            const connectedPort =  nodeObj.getPort(port).getConnectedPort();
            //TODO temporary, all executors should be migrated to be on the port rather than on the obj
            if (connectedPort.getNodeParam().port.execute) {
                connectedPort.getNodeParam().port.execute(connectedPort.getNodeObj(), this.registry);
            } else {
                nodeObj.getPort(port).getConnectedPort().getNodeObj().executor.execute();
            }
        }
    }
}