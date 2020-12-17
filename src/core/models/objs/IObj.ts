import { Registry } from "../../Registry";

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

    dispose(): void;
    serialize(): ObjJson;
    deserialize(json: ObjJson, registry: Registry);
    clone(): IObj;
}