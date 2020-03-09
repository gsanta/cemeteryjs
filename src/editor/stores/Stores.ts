import { LevelStore } from "./LevelStore";
import { CameraStore } from "./CameraStore";
import { ConceptStore } from "./ConceptStore";
import { ViewStore } from './ViewStore';


export class Stores {
    conceptStore = new ConceptStore();
    levelStore = new LevelStore();
    cameraStore: CameraStore;
    viewStore = new ViewStore();

    constructor(canvasId?: string) {
        if (canvasId) {
            this.cameraStore = new CameraStore(canvasId);
        }
    }
}