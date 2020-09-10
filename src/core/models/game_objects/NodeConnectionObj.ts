import { IGameObj, ObjJson } from "./IGameObj";

export class NodeConnectionObj implements IGameObj {
    id: string;
    joinPoint1: string;
    node1: string;
    joinPoint2: string;
    node2: string;

    toJson(): ObjJson { return null; }
    fromJson(json: ObjJson) {}
}