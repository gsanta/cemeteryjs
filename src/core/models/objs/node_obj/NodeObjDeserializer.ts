import { Registry } from "../../../Registry";
import { NodeObj, NodeObjJson } from "./NodeObj";
import { NodePortObjJson } from "../NodePortObj";
import { NodeParam, NodeParamJson } from "./NodeParam";


export class NodeObjDeserialize {
    private nodeObj: NodeObj;

    constructor(nodeObj: NodeObj) {
        this.nodeObj = nodeObj;
    }

    deserialize(json: NodeObjJson, registry: Registry): void {
        this.nodeObj.id = json.id;
        this.nodeObj.name = json.name;
        this.nodeObj.type = json.type;
        json.params.forEach(jsonParam => {
            const param = <NodeParam> this.nodeObj.param[jsonParam.name];
            param && param.fromJson ? param.fromJson(registry, jsonParam) : this.defaultNodeParamDeserializer(jsonParam)
        });
        this.nodeObj.initParams();

        const portJsonMap: Map<string, NodePortObjJson> = new Map();
        json.ports.forEach(port => portJsonMap.set(port.name, port));

        this.nodeObj.getPorts().forEach(port => {
            const portJson = portJsonMap.get(port.getNodeParam().name);

            if (portJson.connectedObjIds) {
                portJson.connectedObjIds.forEach((connectedObjId, index)  => {
                    const connectedObj = <NodeObj> registry.stores.objStore.getById(connectedObjId);
                    if (connectedObj) {
                        port.addConnectedPort(connectedObj.getPort(portJson.connectedPortNames[index]));
                    }
                });
            }
        });
    }

    
    private defaultNodeParamDeserializer(json: NodeParamJson): void {
        let param: NodeParam;

        if (this.nodeObj.param[json.name]) {
            param = this.nodeObj.param[json.name];
            param.ownVal = json.val;
            param.setVal ? param.setVal(json.val) : param.ownVal = json.val;
        } else {
            param = { 
                name: json.name,
                ownVal: json.val,
                portDirection: json.portDirection,
                portDataFlow: json.portDataflow
            }
            this.nodeObj.param[json.name] = param;
        }
    }
}
