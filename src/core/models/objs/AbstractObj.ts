import { Registry } from "../../Registry";
import { Canvas3dPanel } from "../modules/Canvas3dPanel";
import { IObj, ObjJson } from "./IObj";


export abstract class AbstractObj implements IObj {
    abstract objType: string;
    abstract id: string;
    abstract canvas: Canvas3dPanel;
    name: string;
    dispose(): void {}
    serialize(): ObjJson { return undefined; }
    deserialize(json: ObjJson, registry: Registry) {}
    clone(): IObj { return undefined; }
}