import { AssetModel, AssetType } from "../models/game_objects/AssetModel";


export class AssetStore {
    private maxIdForPrefix: Map<string, number> = new Map();
    private assetsById: Map<string, AssetModel> = new Map();
    
    constructor() {
        this.maxIdForPrefix = new Map([
            ['model', 0],
            ['texture', 0],
            ['thumbnail', 0],
        ]);
    }

    addAsset(assetModel: AssetModel): string {
        switch(assetModel.assetType) {
            case AssetType.Model:
                return this.addModel(assetModel);
            case AssetType.Texture:
                return this.addTexture(assetModel);
            case AssetType.Thumbnail:
                return this.addThumbnail(assetModel);
        }
    }

    addModel(assetModel: AssetModel): string {
        if (!assetModel.getId()) {
            assetModel.setId(this.generateId('model'));
        }

        this.assetsById.set(assetModel.getId(), assetModel);
        return assetModel.getId();
    }

    addThumbnail(assetModel: AssetModel): string {
        if (!assetModel.getId()) {
            assetModel.setId(this.generateId('thumbnail'));
        }

        this.assetsById.set(assetModel.getId(), assetModel);
        return assetModel.getId();
    }

    addTexture(assetModel: AssetModel): string {
        if (!assetModel.getId()) {
            assetModel.setId(this.generateId('texture'));
        }

        this.assetsById.set(assetModel.getId(), assetModel);
        return assetModel.getId();
    }

    getAssetById(id: string): AssetModel {
        if (!id) { return undefined; }
        
        return this.assetsById.get(id);
    }

    getByType(type: AssetType): AssetModel[] {
        return this.getAssets().filter(asset => asset.assetType === type);
    }

    getAssets(): AssetModel[] {
        return Array.from(this.assetsById.values());
    }

    private generateId(assetPrefix: string) {
        const idIndex = this.maxIdForPrefix.get(assetPrefix);
        this.maxIdForPrefix.set(assetPrefix, idIndex + 1);
        return `${assetPrefix}-${idIndex + 1}`.toLocaleLowerCase();
    }
}