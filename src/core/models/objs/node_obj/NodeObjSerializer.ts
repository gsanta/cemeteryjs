import { NodeObj, NodeObjJson } from "./NodeObj";
import { NodePortObjJson } from "../NodePortObj";
import { NodeParam, NodeParamJson } from "./NodeParam";

export class NodeObjSerializer {
    private nodeObj: NodeObj;

    constructor(nodeObj: NodeObj) {
        this.nodeObj = nodeObj;
    }

    serialize(): NodeObjJson {
        const params = this.nodeObj.getParams()
            .filter(param => !param.doNotSerialize)
            .map(param => param.toJson ? param.toJson() : this.defaultNodeParamSerializer(param));

        const portJsons = this.nodeObj.getPorts().map(port => {
            let portJson: NodePortObjJson = { name: port.getNodeParam().name };

            if (port.hasConnectedPort()) {
                portJson.connectedObjIds = port.getConnectedPorts().map(connectedPort => connectedPort.getNodeObj().id);
                portJson.connectedPortNames = port.getConnectedPorts().map(connectedPort => connectedPort.getNodeParam().name);
            }

            return portJson;
        });

        return {
            id: this.nodeObj.id,
            name: this.nodeObj.name,
            objType: this.nodeObj.objType,
            type: this.nodeObj.type,
            params: params,
            ports: portJsons
        }
    }

    private defaultNodeParamSerializer(param: NodeParam): NodeParamJson {
        const json: NodeParamJson = {
            name: param.name,
            val: param.ownVal,
        }

        json.portDataflow = param.portDataFlow;
        json.portDirection = param.portDirection;
    
        return json;
    }
}