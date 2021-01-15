import { AbstractObj } from "./AbstractObj";
import { NodeObj } from "./node_obj/NodeObj";
import { NodeParam, PortDataFlow, PortDirection } from "./node_obj/NodeParam";

export interface NodePortObjJson {
    name: string;
    connectedObjIds?: string[];
    connectedPortNames?: string[];
} 


export const NodePortObjType = 'node-port-obj';
export class NodePortObj<D = any> extends AbstractObj {
    objType: string = NodePortObjType;
    id: string;
    name: string;

    private connectedPortObjs: NodePortObj[] = [];
    private readonly nodeObj: NodeObj;
    private readonly param: NodeParam;

    constructor(nodeObj: NodeObj, param: NodeParam<D>) {
        super();
        this.id = param.name;
        this.nodeObj = nodeObj;
        this.param = param;

        if (!param.portDirection) {
            throw new Error(`NodeParam '${param.name}' is not a port.`);
        }
    }

    addConnectedPort(otherPortObj: NodePortObj) {
        if (!this.connectedPortObjs.includes(otherPortObj)) {
            this.connectedPortObjs.push(otherPortObj);        
            if (!otherPortObj.getConnectedPorts().includes(this)) {
                otherPortObj.addConnectedPort(this);
            }
    
            this.nodeObj.graph.onConnect([this.nodeObj, this.param.name], [otherPortObj.nodeObj, otherPortObj.param.name]);
        }
    }

    getConnectedPorts(): NodePortObj[] {
        return this.connectedPortObjs;
    }

    removeConnectedPort(portObj: NodePortObj) {
        if (this.connectedPortObjs.includes(portObj)) {
            this.nodeObj.graph.onDisconnect([this.nodeObj, this.param.name], [portObj.nodeObj, portObj.param.name]);
            this.connectedPortObjs = this.connectedPortObjs.filter(obj => obj !== portObj);
        }
    }

    hasConnectedPort() {
        return this.connectedPortObjs.length > 0;
    }

    getNodeObj() {
        return this.nodeObj;
    }
    
    getNodeParam(): NodeParam {
        return this.param;
    }

    hasListener() {
        return !!this.param.listener;
    }

    getListener() {
        return this.param.listener;
    }

    isInputPort() {
        return this.param.portDirection === PortDirection.Input;
    }

    isPushPort() {
        return this.param.portDataFlow === PortDataFlow.Push;
    }

    dispose(): void {
        this.connectedPortObjs.forEach(portObj => this.removeConnectedPort(portObj));
    }

    pull(): D[] {
        if (this.param.portDirection !== PortDirection.Input) {
            throw new Error('Pull should only be called for Input ports');
        }

        if (this.param.portDataFlow !== PortDataFlow.Pull) {
            throw new Error('Pull should only be called for ports with "pull" data flow');
        }

        if (this.hasConnectedPort()) {
            const ports = this.getConnectedPorts();

            return ports.map(port => {
                if (port.getNodeParam().getPortOrOwnVal) {
                    return port.getNodeParam().getPortOrOwnVal();
                } else {
                    return port.getNodeParam().ownVal;
                }
            });
        }

        this.param.onPull && this.param.onPull();
    }

    push() {
        this.getConnectedPorts().forEach(portObj => {
            //TODO temporary, all executors should be migrated to be on the port rather than on the obj
            if (portObj.getNodeParam().execute) {
                portObj.getNodeParam().execute();
            } else {
                portObj.getNodeObj().executor.execute();
            }
        });
    }
}