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

export interface ObjFactory {
    objType: string;
    newInstance(): IObj;
    insantiateFromJson(objJson: ObjJson): [IObj, AfterAllObjsDeserialized]
}

export abstract class ObjFactoryAdapter implements ObjFactory {
    objType: string;

    constructor(objType: string) {
        this.objType = objType;
    }

    newInstance(): IObj { return undefined; }
    insantiateFromJson(objJson: ObjJson): [IObj, AfterAllObjsDeserialized] { return undefined; }

}

export interface IObj {
    id: string;
    name: string;
    readonly objType: string;
    readonly canvas: Canvas3dPanel;

    dispose(): void;
    serialize(): ObjJson;
    deserialize(json: ObjJson, registry: Registry);
    clone(registry: Registry): IObj;
}