import { Registry } from "../../Registry";
import { IObj, ObjJson } from "./IObj";


export abstract class ObjAdapter implements IObj {
    abstract id: string;
    abstract objType: string;
    dispose(): void {}
    serialize(): ObjJson { return undefined; }
    deserialize(json: ObjJson, registry: Registry) {}
    clone(): IObj { return undefined; }
}