import { Registry } from "../Registry";
import { AssetStore } from "./AssetStore";
import { LevelStore } from "./LevelStore";
import { SpriteSheetObjStore } from "./SpriteSheetObjStore";
import { IdGenerator } from "./IdGenerator";
import { ViewStore } from "./ViewStore";
import { MeshView } from "../models/views/MeshView";
import { PathView } from "../models/views/PathView";
import { SpriteView } from "../models/views/SpriteView";
import { NodeView } from "../models/views/NodeView";
import { NodeConnectionView } from "../models/views/NodeConnectionView";

export const SceneStoreId = 'scene-store';
export const SpriteStoreId = 'sprite-store';
export const NodeStoreId = 'node-store';

export class Stores {
    private registry: Registry
    // view:

    private viewStores: ViewStore[] = [];

    canvasStore: ViewStore;
    levelStore: LevelStore;
    spriteStore: ViewStore;
    nodeStore: ViewStore;
    assetStore: AssetStore;

    spriteSheetObjStore: SpriteSheetObjStore;

    constructor(registry: Registry) {
        this.registry = registry;
        this.canvasStore = new ViewStore(SceneStoreId);
        this.levelStore = new LevelStore();
        this.spriteStore = new ViewStore(SpriteStoreId);
        this.nodeStore = new ViewStore(NodeStoreId);
        this.assetStore = new AssetStore(this.registry);
        this.spriteSheetObjStore = new SpriteSheetObjStore();

        this.viewStores.push(
            this.canvasStore,
            this.nodeStore,
            this.spriteStore,
        );

        this.viewStores.forEach(store => store.setIdGenerator(new IdGenerator()));
        this.assetStore.setIdGenerator(new IdGenerator());
        this.spriteSheetObjStore.setIdGenerator(new IdGenerator());
    }

    clear() {
        this.viewStores.forEach(viewStore => viewStore.clear());
        this.assetStore.clear();
        this
    }
}