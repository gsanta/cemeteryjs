import { Registry } from "../../Registry";
import { Canvas3dPanel } from "../modules/Canvas3dPanel";

export interface ObjJson {
    id: string;
    name: string;
    objType: string;
}

export interface AfterAllObjsDeserialized {
    (): void;
}

export interface IObj {
    id: string;
    name: string;
    readonly objType: string;
    readonly canvas: Canvas3dPanel;

    dispose(): void;
    serialize(): ObjJson;
    deserialize(json: ObjJson, registry: Registry): AfterAllObjsDeserialized;
    clone(registry: Registry): IObj;
}