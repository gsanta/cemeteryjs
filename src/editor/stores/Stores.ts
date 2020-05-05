import { LevelStore } from "./LevelStore";
import { ViewStore } from './ViewStore';
import { CanvasStore } from "./CanvasStore";
import { HoverStore } from "./HoverStore";
import { SelectionStore } from "./SelectionStore";
import { GameStore } from "../../game/models/stores/GameStore";
import { MeshStore } from "../../game/models/stores/MeshStore";
import { FeedbackStore } from "./FeedbackStore";
import { Registry } from "../Registry";
import { ActionStore } from './ActionStore';

export class Stores {
    private registry: Registry

    constructor(registry: Registry) {
        this.registry = registry;
        this.canvasStore = new CanvasStore(this.registry);
        this.hoverStore = new HoverStore();
        this.selectionStore = new SelectionStore();
        this.levelStore = new LevelStore();
        this.viewStore = new ViewStore();
        this.gameStore = new GameStore(this.registry);
        this.meshStore = new MeshStore(this.registry);
        this.feedback = new FeedbackStore();
        this.actionStore = new ActionStore(this.registry);
    }

    canvasStore: CanvasStore;
    hoverStore: HoverStore;
    selectionStore: SelectionStore;
    levelStore: LevelStore;
    viewStore: ViewStore;
    gameStore: GameStore;
    meshStore: MeshStore;
    feedback: FeedbackStore;
    actionStore: ActionStore;
}