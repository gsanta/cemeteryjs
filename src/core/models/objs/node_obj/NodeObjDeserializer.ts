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
            const param = <NodeParam> this.nodeObj.param[json.name];
            param && param.fromJson ? param.fromJson(registry, jsonParam) : this.defaultNodeParamDeserializer(jsonParam)
        });
        this.nodeObj.initParams();

        const portJsonMap: Map<string, NodePortObjJson> = new Map();
        json.ports.forEach(port => portJsonMap.set(port.name, port));

        this.nodeObj.getPorts().forEach(port => {
            const portJson = portJsonMap.get(port.getNodeParam().name);
            if (portJson.connectedObjId) {
                const connectedObj = <NodeObj> registry.stores.objStore.getById(portJson.connectedObjId);
                if (connectedObj) {
                    port.setConnectedPort(connectedObj.getPort(portJson.connectedPortName));
                }
            }
        });
    }

    
    private defaultNodeParamDeserializer(json: NodeParamJson): void {
        let param: NodeParam;

        if (this.nodeObj.param[json.name]) {
            param = this.nodeObj.param[json.name];
            param.val = json.val;
        } else {
            param = { 
                name: json.name,
                val: json.val,
                field: json.field,
                port: json.port
            }
            this.nodeObj.param[json.name] = param;
        }
    }
}
