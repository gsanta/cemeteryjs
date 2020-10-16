import { IObj, ObjFactory } from "./IObj";

export const AssetObjType = 'asset-obj';

export interface AssetObjJson {
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

export class AssetObjFactory implements ObjFactory {
    objType = AssetObjType;
    newInstance() {
        return new AssetObj();
    }
}

export class AssetObj implements IObj {
    objType = AssetObjType;
    id: string;
    assetType: AssetType;
    data: string;
    path: string;
    name: string;

    constructor(config?: {data?: string, path?: string, name?: string, assetType: AssetType}) {
        if (config) {
            this.data = config.data;
            this.assetType = config.assetType;
            this.path = config.path;
            this.name = config.name;
        }
    }

    dispose() {}

    serialize(): AssetObjJson {
        return {
            id: this.id,
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