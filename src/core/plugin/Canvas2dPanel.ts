import { Camera2D } from "../models/misc/camera/Camera2D";
import { AbstractCanvasPanel } from "./AbstractCanvasPanel";
import { ViewStore } from '../stores/ViewStore';

export class Canvas2dPanel extends AbstractCanvasPanel {
    private viewStore: ViewStore;

    setCamera(camera: Camera2D) {
        super.setCamera(camera);
    }

    setViewStore(viewStore: ViewStore) {
        this.viewStore = viewStore;
    }

    getViewStore() {
        return this.viewStore;
    }
}