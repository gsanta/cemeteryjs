import { Registry } from "../Registry";
import { AssetStore } from "./AssetStore";
import { LevelStore } from "./LevelStore";
import { IdGenerator } from "./IdGenerator";
import { ViewStore } from "./ViewStore";
import { ObjStore } from "./ObjStore";

export const SceneStoreId = 'scene-store';
export const SpriteStoreId = 'sprite-store';
export const NodeStoreId = 'node-store';

export class Stores {
    private registry: Registry

    levelStore: LevelStore;
    assetStore: AssetStore;

    objStore: ObjStore;
    viewStore: ViewStore;

    constructor(registry: Registry) {
        this.registry = registry;
        this.levelStore = new LevelStore();
        this.assetStore = new AssetStore(this.registry);
        this.objStore = new ObjStore();
        this.viewStore = new ViewStore();

        this.viewStore.setIdGenerator(new IdGenerator());
        this.assetStore.setIdGenerator(new IdGenerator());
        this.objStore.setIdGenerator(new IdGenerator());
    }

    clear() {
        this.viewStore.clear();
        this.assetStore.clear();
        this
    }
}