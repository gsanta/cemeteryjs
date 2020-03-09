import { LevelStore } from "./LevelStore";
import { ConceptStore } from "./ConceptStore";
import { ViewStore } from './ViewStore';


export class Stores {
    conceptStore = new ConceptStore();
    levelStore = new LevelStore();
    viewStore = new ViewStore();
}