import { IObj, ObjFactory, ObjFactoryAdapter, ObjJson } from "./IObj";

export const AssetObjType = 'asset-obj';

export interface AssetObjJson extends ObjJson {
    id: string;
    assetType: string;
    path?: string;
    data: string;
    name: string;
}

export enum AssetType {
    Model = 'Model',
    Texture = 'Texture',
    Thumbnail = 'Thumbnail',
    SpriteSheet = 'SpriteSheet',
    SpriteSheetJson = 'SpriteSheetJson'
}

export class AssetObjFactory extends ObjFactoryAdapter {
    constructor() {
        super(AssetObjType);
    }

    newInstance() {
        return new AssetObj();
    }
}

export class AssetObj implements IObj {
    readonly objType = AssetObjType;
    name: string;
    id: string;
    assetType: AssetType;
    data: string;
    path: string;

    constructor(config?: {data?: string, path?: string, name?: string, assetType: AssetType}) {
        if (config) {
            this.data = config.data;
            this.assetType = config.assetType;
            this.path = config.path;
            this.name = config.name;
        }
    }

    dispose() {}

    clone(): AssetObj {
        return new AssetObj({data: this.data, path: this.path, name: this.name, assetType: this.assetType});
    }

    serialize(): AssetObjJson {
        return {
            id: this.id,
            objType: this.objType,
            assetType: this.assetType,
            path: this.path,
            data: this.data,
            name: this.name
        };
    }

    deserialize(json: AssetObjJson) {
        this.id = json.id;
        this.assetType = <AssetType> json.assetType;
        this.path = json.path;
        this.data = json.data;
        this.name = json.name;
    }
}