

export interface ObjJson {
    id: string;
}
export interface IGameObj {
    id: string;

    toJson(): ObjJson;
    fromJson(json: ObjJson);
}