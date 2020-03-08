import { LevelStore } from "./LevelStore";
import { CameraStore } from "./CameraStore";
import { ViewStore } from "./ViewStore";


export class Stores {
    viewStore = new ViewStore();
    levelStore = new LevelStore();
    cameraStore: CameraStore;

    constructor(canvasId?: string) {
        if (canvasId) {
            this.cameraStore = new CameraStore(canvasId);
        }
    }

}