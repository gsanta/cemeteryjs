import { LevelStore } from "./LevelStore";
import { ConceptStore } from "./ConceptStore";
import { ViewStore } from './ViewStore';
import { CanvasStore } from "./CanvasStore";
import { HoverStore } from "./HoverStore";
import { SelectionStore } from "./SelectionStore";


export class Stores {
    canvasStore = new CanvasStore(() => this);
    hoverStore = new HoverStore();
    selectionStore = new SelectionStore();
    levelStore = new LevelStore();
    viewStore = new ViewStore();
}