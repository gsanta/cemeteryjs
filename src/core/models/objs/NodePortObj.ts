import { Registry } from "../../Registry";
import { IObj, ObjJson } from "./IObj";
import { NodeObj, NodeParam, PortDirection } from "./NodeObj";

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

    setConnectedPort(nodePortObj: NodePortObj) {        
        this.connectedPortObj = nodePortObj;
        this.nodeObj.graph.onConnect([this.nodeObj, this.param.name], [nodePortObj.nodeObj, nodePortObj.param.name]);
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