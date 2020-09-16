import { Registry } from "../Registry";
import { AbstractStore } from "./AbstractStore";
import { AssetStore } from "./AssetStore";
import { LevelStore } from "./LevelStore";
import { NodeStore } from './NodeStore';
import { SceneStore } from "./SceneStore";
import { SelectionStore } from "./SelectionStore";
import { SpriteStore } from "./SpriteStore";
import { SpriteSheetObjStore } from "./SpriteSheetObjStore";
import { IdGenerator } from "./IdGenerator";

export class Stores {
    private registry: Registry
    private stores: AbstractStore<any>[] = [];

    // view:

    getViewStore(id: string) {

    }

    canvasStore: SceneStore;
    selectionStore: SelectionStore;
    levelStore: LevelStore;
    spriteStore: SpriteStore;
    nodeStore: NodeStore;
    assetStore: AssetStore;

    spriteSheetObjStore: SpriteSheetObjStore;

    constructor(registry: Registry) {
        this.registry = registry;
        this.canvasStore = new SceneStore(this.registry);
        this.selectionStore = new SelectionStore();
        this.levelStore = new LevelStore();
        this.spriteStore = new SpriteStore(this.registry);
        this.nodeStore = new NodeStore(this.registry);
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