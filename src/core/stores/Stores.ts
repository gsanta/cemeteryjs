import { Registry } from "../Registry";
import { AssetStore } from "./AssetStore";
import { LevelStore } from "./LevelStore";
import { IdGenerator } from "./IdGenerator";
import { ViewStore } from "./ViewStore";
import { AbstractObjStore } from "./AbstractObjStore";

export const SceneStoreId = 'scene-store';
export const SpriteStoreId = 'sprite-store';
export const NodeStoreId = 'node-store';

export class Stores {
    private registry: Registry

    private viewStores: ViewStore[] = [];

    canvasStore: ViewStore;
    levelStore: LevelStore;
    spriteStore: ViewStore;
    nodeStore: ViewStore;
    assetStore: AssetStore;
    objStore: AbstractObjStore<any>;

    constructor(registry: Registry) {
        this.registry = registry;
        this.canvasStore = new ViewStore(SceneStoreId);
        this.levelStore = new LevelStore();
        this.spriteStore = new ViewStore(SpriteStoreId);
        this.nodeStore = new ViewStore(NodeStoreId);
        this.assetStore = new AssetStore(this.registry);
        this.objStore = new AbstractObjStore();

        this.viewStores.push(
            this.canvasStore,
            this.nodeStore,
            this.spriteStore,
        );

        this.viewStores.forEach(store => store.setIdGenerator(new IdGenerator()));
        this.assetStore.setIdGenerator(new IdGenerator());
        this.objStore.setIdGenerator(new IdGenerator());
    }

    clear() {
        this.viewStores.forEach(viewStore => viewStore.clear());
        this.assetStore.clear();
        this
    }
}