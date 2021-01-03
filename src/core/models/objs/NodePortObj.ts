import { AbstractObj } from "./AbstractObj";
import { NodeObj } from "./node_obj/NodeObj";
import { NodeParam, PortDataFlow, PortDirection } from "./node_obj/NodeParam";

export interface NodePortObjJson {
    name: string;
    connectedObjIds?: string[];
    connectedPortNames?: string[];
} 


export const NodePortObjType = 'node-port-obj';
export class NodePortObj extends AbstractObj {
    objType: string = NodePortObjType;
    id: string;
    name: string;

    private connectedPortObjs: NodePortObj[] = [];
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

    addConnectedPort(otherPortObj: NodePortObj) {
        if (!this.connectedPortObjs.includes(otherPortObj)) {
            this.connectedPortObjs.push(otherPortObj);        
            this.param.fieldDisabled = true;
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
        this.connectedPortObjs.forEach(portObj => this.removeConnectedPort(portObj));
    }
}