

export interface AssetJson {
    id: string;
    assetType: string;
    path?: string;
    data: string;
    name: string;
}

export enum AssetType {
    Model = 'Model',
    Texture = 'Texture',
    Thumbnail = 'Thumbnail'
}

export class AssetObject {
    id: string;
    assetType: AssetType;
    data: string;
    thumbnailData: string;
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

    toJson(): AssetJson {
        return {
            id: this.id,
            assetType: this.assetType,
            path: this.path,
            data: undefined, // do not serialize, too expensive
            name: this.name
        };
    }

    fromJson(json: AssetJson) {
        this.id = json.id;
        this.assetType = <AssetType> json.assetType;
        this.path = json.path;
        this.data = json.data;
        this.name = json.name;
    }
}