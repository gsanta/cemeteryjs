import { AssetModel, AssetType } from "./game_objects/AssetModel";
import { AbstractStore } from "./AbstractStore";
import { Registry } from "../Registry";

export class AssetStore extends AbstractStore {
    static actions = {
        ASSET_DELETE: 'ASSET_DELETE'
    }

    static id = 'asset-store'; 
    id = AssetStore.id;

    private maxIdForPrefix: Map<string, number> = new Map();
    private assetsById: Map<string, AssetModel> = new Map();
    private registry: Registry;

    constructor(registry: Registry) {
        super();

        this.registry = registry;
        this.maxIdForPrefix = new Map([
            ['model', 0],
            ['texture', 0],
            ['thumbnail', 0],
        ]);
    }

    deleteAsset(assetModel: AssetModel) {
        this.assetsById.delete(assetModel.id);

        this.registry.services.event.dispatch(AssetStore.actions.ASSET_DELETE, [assetModel]);
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
        if (!assetModel.id) {
            assetModel.id = this.generateId('model');
        }

        this.assetsById.set(assetModel.id, assetModel);
        return assetModel.id;
    }

    addThumbnail(assetModel: AssetModel): string {
        if (!assetModel.id) {
            assetModel.id = this.generateId('thumbnail');
        }

        this.assetsById.set(assetModel.id, assetModel);
        return assetModel.id;
    }

    addTexture(assetModel: AssetModel): string {
        if (!assetModel.id) {
            assetModel.id = this.generateId('texture');
        }

        this.assetsById.set(assetModel.id, assetModel);
        return assetModel.id;
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