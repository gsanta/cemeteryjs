import { LevelStore } from "./LevelStore";
import { ViewStore } from './ViewStore';
import { CanvasStore } from "./CanvasStore";
import { HoverStore } from "./HoverStore";
import { SelectionStore } from "./SelectionStore";
import { GameStore } from "../../game/models/stores/GameStore";
import { MeshStore } from "../../game/models/stores/MeshStore";


export class Stores {
    canvasStore = new CanvasStore(() => this);
    hoverStore = new HoverStore();
    selectionStore = new SelectionStore();
    levelStore = new LevelStore();
    viewStore = new ViewStore();
    gameStore = new GameStore();
    meshStore = new MeshStore();
}