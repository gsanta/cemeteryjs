import { Registry } from "../../Registry";
import { IObj, ObjJson } from "./IObj";


export abstract class AbstractObj implements IObj {
    abstract objType: string;
    abstract id: string;
    name: string;
    dispose(): void {}
    serialize(): ObjJson { return undefined; }
    deserialize(json: ObjJson, registry: Registry) {}
    clone(): IObj { return undefined; }
}