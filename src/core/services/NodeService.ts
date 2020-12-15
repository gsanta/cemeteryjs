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

    pullData(nodeObj: NodeObj, portName: string) {
        // TODO check that port is output port
        if (nodeObj.getPort(portName).hasConnectedPort()) {
            const otherPort = nodeObj.getPort(portName).getConnectedPort();
            const nodeParam = otherPort.getNodeParam();
            if (nodeParam.getData) {
                return nodeParam.getData(otherPort.getNodeObj(), this.registry);
            } else {
                // TODO this is legacy should port to the getData method
                return nodeObj.getPort(portName).getConnectedPort().getNodeParam().val;
            }
        }
    }
}