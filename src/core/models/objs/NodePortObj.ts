import { AbstractObj } from "./AbstractObj";
import { NodeObj } from "./node_obj/NodeObj";
import { NodeParam, PortDataFlow, PortDirection } from "./node_obj/NodeParam";

export interface NodePortObjJson {
    name: string;
    connectedObjId?: string;
    connectedPortName?: string;
} 


export const NodePortObjType = 'node-port-obj';
export class NodePortObj extends AbstractObj {
    objType: string = NodePortObjType;
    id: string;
    name: string;

    private connectedPortObj: NodePortObj;
    private readonly nodeObj: NodeObj;
    private readonly param: NodeParam;

    constructor(nodeObj: NodeObj, param: NodeParam) {
        super();
        this.id = param.name;
        this.nodeObj = nodeObj;
        this.param = param;

        if (!param.port) {
            throw new Error(`NodeParam '${param.name}' is not a port.`);
        }
    }

    setConnectedPort(otherPortObj: NodePortObj) {        
        this.connectedPortObj = otherPortObj;        
        this.param.fieldDisabled = true;
        if (otherPortObj.getConnectedPort() !== this) {
            console.log(otherPortObj.getNodeParam().name)
            console.log(otherPortObj.getNodeObj().getPorts().indexOf(otherPortObj))
            otherPortObj.setConnectedPort(this);
        }
        console.log((otherPortObj.getNodeObj() as NodeObj).getPorts().map(port => `${port.getNodeParam().name} ${port.hasConnectedPort()}`).join(', '))

        this.nodeObj.graph.onConnect([this.nodeObj, this.param.name], [otherPortObj.nodeObj, otherPortObj.param.name]);
    }

    getConnectedPort(): NodePortObj {
        return this.connectedPortObj;
    }

    removeConnectedPort() {
        if (this.hasConnectedPort()) {
            const connectedPortObj = this.getConnectedPort();
            this.nodeObj.graph.onDisconnect([this.nodeObj, this.param.name], [connectedPortObj.nodeObj, connectedPortObj.param.name]);
        }
        this.connectedPortObj = undefined;
    }

    hasConnectedPort() {
        return !!this.getConnectedPort();
    }

    getNodeObj() {
        return this.nodeObj;
    }
    
    getNodeParam(): NodeParam {
        return this.param;
    }

    hasListener() {
        return !!this.param.port.listener;
    }

    getListener() {
        return this.param.port.listener;
    }

    isInputPort() {
        return this.param.port.direction === PortDirection.Input;
    }

    isPushPort() {
        return this.param.port.dataFlow === PortDataFlow.Push;
    }

    dispose(): void {
        this.removeConnectedPort();
    }
}