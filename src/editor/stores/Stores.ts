import { LevelStore } from "./LevelStore";
import { CameraStore } from "./CameraStore";
import { ConceptStore } from "./ConceptStore";


export class Stores {
    viewStore = new ConceptStore();
    levelStore = new LevelStore();
    cameraStore: CameraStore;

    constructor(canvasId?: string) {
        if (canvasId) {
            this.cameraStore = new CameraStore(canvasId);
        }
    }

}