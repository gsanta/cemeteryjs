

export interface AssetJson {
    id: string;
    assetType: string;
    path: string;
    thumbnailData: string;
}

export enum AssetType {
    Model = 'Model',
    Texture = 'Texture',
    Thumbnail = 'Thumbnail'
}

export class AssetModel {
    private id: string;
    assetType: AssetType;
    path: string;
    data: string;
    thumbnailData: string;

    constructor(config?: {path: string, data?: string, assetType: AssetType}) {
        if (config) {
            this.path = config.path;
            this.data = config.data;
            this.assetType = config.assetType;
        }
    }

    getId() {
        return this.id;
    }

    setId(id: string) {
        this.id = id;
    }

    toJson(): AssetJson {
        return {
            id: this.id,
            assetType: this.assetType,
            path: this.path,
            thumbnailData: this.thumbnailData
        };
    }

    fromJson(json: AssetJson) {
        this.id = json.id;
        this.assetType = <AssetType> json.assetType;
        this.path = json.path;
        this.thumbnailData = json.thumbnailData;
    }
}