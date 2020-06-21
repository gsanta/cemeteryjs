

export interface AssetJson {
    id: string;
    assetType: string;
    // path: string;
    data: string;
}

export enum AssetType {
    Model = 'Model',
    Texture = 'Texture',
    Thumbnail = 'Thumbnail'
}

export class AssetModel {
    private id: string;
    assetType: AssetType;
    data: string;
    thumbnailData: string;

    constructor(config?: {data?: string, assetType: AssetType}) {
        if (config) {
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
            // path: this.path,
            data: undefined // do not serialize, too expensive
        };
    }

    fromJson(json: AssetJson) {
        this.id = json.id;
        this.assetType = <AssetType> json.assetType;
        // this.path = json.path;
        this.data = json.data;
    }
}