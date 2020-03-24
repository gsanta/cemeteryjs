import { LevelStore } from "./LevelStore";
import { ConceptStore } from "./ConceptStore";
import { ViewStore } from './ViewStore';
import { CanvasStore } from "./CanvasStore";
import { HoverStore } from "./HoverStore";
import { SelectionStore } from "./SelectionStore";


export class Stores {
    conceptStore = new ConceptStore();
    canvasStore = new CanvasStore();
    hoverStore = new HoverStore();
    selectionStore = new SelectionStore();
    levelStore = new LevelStore();
    viewStore = new ViewStore();
}