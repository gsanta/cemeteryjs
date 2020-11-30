import { IObj, ObjFactory, ObjFactoryAdapter, ObjJson } from "./IObj";
import { NodeObj } from "./NodeObj";
import { Registry } from "../../Registry";

export const NodeConnectionObjType = 'node-connection-obj';

export interface NodeConnectionObjJson extends ObjJson {
    id: string;
    joinPoint1: string;
    node1Id: string;
    joinPoint2: string;
    node2Id: string
}

export class NodeConnectionObjFactory extends ObjFactoryAdapter {
    constructor() {
        super(NodeConnectionObjType);
    }

    newInstance() {
        return new NodeConnectionObj();
    }
}

export class NodeConnectionObj implements IObj {
    id: string;
    objType = NodeConnectionObjType;
    joinPoint1: string;
    node1: NodeObj;
    joinPoint2: string;
    node2: NodeObj

    getOtherNode(node: NodeObj) {
        return node === this.node1 ? this.node2 : this.node1;
    }

    dispose() {}

    clone(): NodeConnectionObj {
        throw new Error('not implemented');
    }

    serialize(): NodeConnectionObjJson {
        return {
            id: this.id,
            objType: this.objType,
            joinPoint1: this.joinPoint1,
            node1Id: this.node1.id,
            joinPoint2: this.joinPoint2,
            node2Id: this.node2.id
        }
    }

    deserialize(json: NodeConnectionObjJson, registry: Registry) {
        this.id = json.id;
        this.joinPoint1 = json.joinPoint1;
        this.node1 = registry.stores.objStore.getById(json.node1Id) as NodeObj;
        this.joinPoint2 = json.joinPoint2;
        this.node2 = registry.stores.objStore.getById(json.node2Id) as NodeObj;
    }
}