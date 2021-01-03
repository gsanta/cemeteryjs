import { NodeObj } from "../models/objs/node_obj/NodeObj";
import { Registry } from "../Registry";


export class NodeService {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    executePort(nodeObj: NodeObj, port: string) {
        const connectedPort = nodeObj.getPort(port).getConnectedPorts();
        nodeObj.getPort(port).getConnectedPorts().forEach(portObj => {
            //TODO temporary, all executors should be migrated to be on the port rather than on the obj
            if (portObj.getNodeParam().port.execute) {
                portObj.getNodeParam().port.execute(portObj.getNodeObj(), this.registry);
            } else {
                portObj.getNodeObj().executor.execute();
            }
        });
    }

    pullData(nodeObj: NodeObj, portName: string) {
        // TODO check that port is output port
        if (nodeObj.getPort(portName).hasConnectedPort()) {
            const otherPort = nodeObj.getPort(portName).getConnectedPorts()[0];
            const nodeParam = otherPort.getNodeParam();
            if (nodeParam.getVal) {
                return nodeParam.getVal();
            } else {
                // TODO this is legacy should port to the getData method
                return nodeObj.getPort(portName).getConnectedPorts()[0].getNodeParam().val;
            }
        }
    }
}