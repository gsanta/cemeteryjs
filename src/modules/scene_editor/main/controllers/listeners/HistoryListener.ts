import { CanvasEventData, CanvasEventType } from "../../../../../core/models/CanvasObservable";
import { Registry } from "../../../../../core/Registry";
import { SceneEditorModule } from "../../SceneEditorModule";


export class HistoryListener {
    private _canvas: SceneEditorModule;
    private _registry: Registry;

    constructor(registry: Registry, canvas: SceneEditorModule) {
        this._registry = registry;
        this._canvas = canvas;
    }

    listen() {
        this._canvas.observable.add((eventData) => this._observer(eventData));
    }

    private _observer(eventData: CanvasEventData) {
        switch(eventData.eventType) {
            case CanvasEventType.PositionChanged:
            case CanvasEventType.RotationChanged:
            case CanvasEventType.ScaleChanged:
                this._registry.services.history.createSnapshot();
            break;
        }
    }

}