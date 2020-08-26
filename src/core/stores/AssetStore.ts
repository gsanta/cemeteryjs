import { AssetObj, AssetType } from "../models/game_objects/AssetObj";
import { AbstractStore } from "./AbstractStore";
import { Registry } from "../Registry";

export class AssetStore extends AbstractStore {
    static actions = {
        ASSET_DELETE: 'ASSET_DELETE'
    }

    static id = 'asset-store'; 
    id = AssetStore.id;

    private maxIdForPrefix: Map<string, number> = new Map();
    private assetsById: Map<string, AssetObj> = new Map();
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

    deleteAsset(asset: AssetObj) {
        this.assetsById.delete(asset.id);

        this.registry.services.event.dispatch(AssetStore.actions.ASSET_DELETE, [asset]);
    }

    addObj(asset: AssetObj): string {
        switch(asset.assetType) {
            case AssetType.Model:
                return this.addModel(asset);
            case AssetType.Texture:
                return this.addTexture(asset);
            case AssetType.Thumbnail:
                return this.addThumbnail(asset);
        }
    }

    private addModel(asset: AssetObj): string {
        if (!asset.id) {
            asset.id = this.generateId('model');
        }

        this.assetsById.set(asset.id, asset);
        return asset.id;
    }

    private addThumbnail(asset: AssetObj): string {
        if (!asset.id) {
            asset.id = this.generateId('thumbnail');
        }

        this.assetsById.set(asset.id, asset);
        return asset.id;
    }

    private addTexture(asset: AssetObj): string {
        if (!asset.id) {
            asset.id = this.generateId('texture');
        }

        this.assetsById.set(asset.id, asset);
        return asset.id;
    }

    getAssetById(id: string): AssetObj {
        if (!id) { return undefined; }
        
        return this.assetsById.get(id);
    }

    getByType(type: AssetType): AssetObj[] {
        return this.getAssets().filter(asset => asset.assetType === type);
    }

    getAssets(): AssetObj[] {
        return Array.from(this.assetsById.values());
    }

    private generateId(assetPrefix: string) {
        const idIndex = this.maxIdForPrefix.get(assetPrefix);
        this.maxIdForPrefix.set(assetPrefix, idIndex + 1);
        return `${assetPrefix}-${idIndex + 1}`.toLocaleLowerCase();
    }
}