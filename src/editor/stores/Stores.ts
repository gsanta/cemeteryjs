import { LevelStore } from "./LevelStore";
import { ViewStore } from './ViewStore';
import { CanvasStore } from "./CanvasStore";
import { HoverStore } from "./HoverStore";
import { SelectionStore } from "./SelectionStore";
import { GameStore } from "../../game/models/stores/GameStore";
import { MeshStore } from "../../game/models/stores/MeshStore";
import { FeedbackStore } from "../views/canvas/models/FeedbackStore";
import { Registry } from "../Registry";

export class Stores {
    private registry: Registry

    constructor(registry: Registry) {
        this.registry = registry;
    }

    canvasStore = new CanvasStore(this.registry);
    hoverStore = new HoverStore();
    selectionStore = new SelectionStore();
    levelStore = new LevelStore();
    viewStore = new ViewStore();
    gameStore = new GameStore(this.registry);
    meshStore = new MeshStore(this.registry);
    feedback = new FeedbackStore();
}