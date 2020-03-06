import { LevelStore } from "./common/stores/LevelStore";
import { CameraStore } from "./windows/canvas/models/CameraStore";
import { ViewStore } from "./windows/canvas/models/ViewStore";


export class Stores {
    viewStore = new ViewStore();
    levelStore = new LevelStore();
    cameraStore: CameraStore;

    constructor(canvasId: string) {
        this.cameraStore = new CameraStore(canvasId);
    }

}