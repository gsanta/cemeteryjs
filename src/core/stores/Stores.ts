import { LevelStore } from "./LevelStore";
import { SceneStore } from "./SceneStore";
import { SelectionStore } from "./SelectionStore";
import { GameStore } from "./GameStore";
import { MeshStore } from "./MeshStore";
import { FeedbackStore } from "./FeedbackStore";
import { Registry } from "../Registry";
import { NodeStore } from './NodeStore';

export class Stores {
    private registry: Registry

    constructor(registry: Registry) {
        this.registry = registry;
        this.canvasStore = new SceneStore(this.registry);
        this.selectionStore = new SelectionStore();
        this.levelStore = new LevelStore();
        this.gameStore = new GameStore(this.registry);
        this.meshStore = new MeshStore(this.registry);
        this.feedback = new FeedbackStore();
        this.nodeStore = new NodeStore(this.registry);
    }

    canvasStore: SceneStore;
    selectionStore: SelectionStore;
    levelStore: LevelStore;
    gameStore: GameStore;
    meshStore: MeshStore;
    feedback: FeedbackStore;
    nodeStore: NodeStore;
}