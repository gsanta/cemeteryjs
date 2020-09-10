import { IGameObj, ObjJson } from "./IGameObj";

export class NodeConnectionObj implements IGameObj {
    id: string;
    joinPoint1: string;
    node1: string;
    joinPoint2: string;
    node2: string;

    getOtherNodeId(nodeId: string) {
        return nodeId === this.node1 ? this.node1 : this.node2;
    }

    toJson(): ObjJson { return null; }
    fromJson(json: ObjJson) {}
}