import { ViewStore } from "./windows/canvas/models/ViewStore";
import { LevelStore } from "./common/stores/LevelStore";


export class Stores {

    viewStore = new ViewStore();
    levelStore = new LevelStore();
}