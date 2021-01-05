import { NodeObj } from "../models/objs/node_obj/NodeObj";
import { Registry } from "../Registry";


export class NodeService {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
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