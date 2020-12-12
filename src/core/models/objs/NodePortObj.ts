import { Registry } from "../../Registry";
import { IObj, ObjJson } from "./IObj";
import { NodeObj, NodeParam, PortDirection } from "./NodeObj";

export interface NodePortObjJson {
    name: string;
    connectedObjId?: string;
    connectedPortName?: string;
} 


export const NodePortObjType = 'node-port-obj';
export class NodePortObj implements IObj {
    id: string;
    objType: string;

    private connectedPortObj: NodePortObj;
    private readonly nodeObj: NodeObj;
    private readonly param: NodeParam;

    constructor(nodeObj: NodeObj, param: NodeParam) {
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

    isInputPort() {
        return this.param.port.direction === PortDirection.Input;
    }

    dispose(): void {
        this.removeConnectedPort();
    }
    serialize(): ObjJson {
        throw new Error("Method not implemented.");
    }
    deserialize(json: ObjJson, registry: Registry) {
        throw new Error("Method not implemented.");
    }
    clone(): IObj {
        throw new Error("Method not implemented.");
    }
}