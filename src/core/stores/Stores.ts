import { LevelStore } from "./LevelStore";
import { SceneStore } from "./SceneStore";
import { SelectionStore } from "./SelectionStore";
import { MeshStore } from "./MeshStore";
import { FeedbackStore } from "./FeedbackStore";
import { Registry } from "../Registry";
import { NodeStore } from './NodeStore';
import { AssetStore } from "./AssetStore";
import { GameStore } from "./GameStore";
import { StoreChangeEvent, AbstractStore } from "./AbstractStore";

export class Stores {
    private registry: Registry
    private stores: AbstractStore<any>[] = [];

    constructor(registry: Registry) {
        this.registry = registry;
        this.canvasStore = new SceneStore(this.registry);
        this.selectionStore = new SelectionStore();
        this.levelStore = new LevelStore();
        this.meshStore = new MeshStore(this.registry);
        this.feedback = new FeedbackStore();
        this.nodeStore = new NodeStore(this.registry);
        this.assetStore = new AssetStore(this.registry);
        this.gameStore = new GameStore(this.registry);

        this.stores.push(
            this.canvasStore,
            this.meshStore,
            this.nodeStore,
            this.assetStore,
            this.gameStore
        )
    }

    canvasStore: SceneStore;
    selectionStore: SelectionStore;
    levelStore: LevelStore;
    meshStore: MeshStore;
    feedback: FeedbackStore;
    nodeStore: NodeStore;
    assetStore: AssetStore;
    gameStore: GameStore;

    dispatch(action: string, changedItems: any[]) {
        this.stores.forEach(store => store.listen(action, changedItems));
    }
}