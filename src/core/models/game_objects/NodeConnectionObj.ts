import { IGameObj, ObjJson } from "./IGameObj";
import { NodeObj } from "./NodeObj";

export class NodeConnectionObj implements IGameObj {
    id: string;
    joinPoint1: string;
    node1: NodeObj;
    joinPoint2: string;
    node2: NodeObj

    getOtherNode(node: NodeObj) {
        return node === this.node1 ? this.node2 : this.node1;
    }

    toJson(): ObjJson { return null; }
    fromJson(json: ObjJson) {}
}