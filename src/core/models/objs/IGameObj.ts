import { Registry } from "../../Registry";


export interface ObjJson {
    id: string;
}
export interface IGameObj {
    id: string;

    dispose(): void;

    toJson(): ObjJson;
    fromJson(json: ObjJson, registry: Registry);
}