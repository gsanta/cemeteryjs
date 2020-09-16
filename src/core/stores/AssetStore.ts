import { AssetObj, AssetType } from "../models/game_objects/AssetObj";
import { AbstractStore } from "./AbstractStore";
import { Registry } from "../Registry";
import { IdGenerator } from "./IdGenerator";

export class AssetStore extends AbstractStore<AssetObj> {
    static id = 'asset-store'; 
    id = AssetStore.id;

    private objs: AssetObj[] = [];

    private assetsById: Map<string, AssetObj> = new Map();
    private assetsByPath: Map<string, AssetObj> = new Map();
    private registry: Registry;
    private idGenerator: IdGenerator;

    constructor(registry: Registry) {
        super();

        this.registry = registry;
    }

    setIdGenerator(idGenerator: IdGenerator) {
        if (this.idGenerator) {
            throw new Error(`Store ${this.id} already has an id generator, for consistency with the store's content, id generator should be set only once.`);
        }
        this.idGenerator = idGenerator;
    }

    deleteAsset(asset: AssetObj) {
        this.assetsById.delete(asset.id);
    }

    addObj(asset: AssetObj): string {
        switch(asset.assetType) {
            case AssetType.Model:
                this.addModel(asset);
                break;
            case AssetType.Texture:
                this.addTexture(asset);
                break;
            case AssetType.Thumbnail:
                this.addThumbnail(asset);
                break;
            default:
                if (!asset.id) {
                    asset.id = this.idGenerator.generateId(asset.assetType);
                }
        
                this.assetsById.set(asset.id, asset);
                break;
        }

        this.assetsByPath.set(asset.path, asset);
        this.objs.push(asset);

        return asset.id;
    }

    private addModel(asset: AssetObj): string {
        if (!asset.id) {
            asset.id = this.idGenerator.generateId('model');
        }

        this.assetsById.set(asset.id, asset);
        return asset.id;
    }

    private addThumbnail(asset: AssetObj): string {
        if (!asset.id) {
            asset.id = this.idGenerator.generateId('thumbnail');
        }

        this.assetsById.set(asset.id, asset);
        return asset.id;
    }

    private addTexture(asset: AssetObj): string {
        if (!asset.id) {
            asset.id = this.idGenerator.generateId('texture');
        }

        this.assetsById.set(asset.id, asset);
        return asset.id;
    }

    lookupByProp(key: keyof AssetObj, val: any) {
        if (key === 'path') {
            return this.assetsByPath.get(val);
        }
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

    getAll(): AssetObj[] {
        return this.objs;
    }

    size() {
        return this.objs.length;
    }

    // private generateId(assetPrefix: string) {
    //     if (this.maxIdForPrefix.get(assetPrefix) === undefined) {
    //         this.maxIdForPrefix.set(assetPrefix, 0);
    //     }

    //     const idIndex = this.maxIdForPrefix.get(assetPrefix);
    //     this.maxIdForPrefix.set(assetPrefix, idIndex + 1);
    //     return `${assetPrefix}-${idIndex + 1}`.toLocaleLowerCase();
    // }
}