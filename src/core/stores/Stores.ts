import { Registry } from "../Registry";
import { AbstractStore } from "./AbstractStore";
import { AssetStore } from "./AssetStore";
import { LevelStore } from "./LevelStore";
import { SpriteSheetObjStore } from "./SpriteSheetObjStore";
import { IdGenerator } from "./IdGenerator";
import { AbstractViewStore } from "./AbstractViewStore";
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
    stores: AbstractStore<any>[] = [];

    // view:

    getViewStore(id: string) {

    }

    canvasStore: AbstractViewStore<MeshView | SpriteView | PathView>;
    levelStore: LevelStore;
    spriteStore: AbstractViewStore<SpriteView>;
    nodeStore: AbstractViewStore<NodeView | NodeConnectionView>;;
    assetStore: AssetStore;

    spriteSheetObjStore: SpriteSheetObjStore;

    constructor(registry: Registry) {
        this.registry = registry;
        this.canvasStore = new AbstractViewStore(SceneStoreId);
        this.levelStore = new LevelStore();
        this.spriteStore = new AbstractViewStore(SpriteStoreId);
        this.nodeStore = new AbstractViewStore(NodeStoreId);
        this.assetStore = new AssetStore(this.registry);
        this.spriteSheetObjStore = new SpriteSheetObjStore();

        this.stores.push(
            this.canvasStore,
            this.nodeStore,
            this.assetStore,
            this.spriteStore,
            this.spriteSheetObjStore
        );

        this.stores.forEach(store => store.setIdGenerator(new IdGenerator()));
    }
}