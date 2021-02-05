import { ObjEventData, ObjEventType, ObjObservable } from "../../../../core/models/ObjObservable";
import { SceneEditorModule } from "../SceneEditorModule";


export class SceneObserver {
    private canvas: SceneEditorModule;

    constructor(canvas: SceneEditorModule) {

    }

    attach(observable: ObjObservable) {
        observable.add((eventData) => this.observer(eventData));
    }

    private observer(eventData: ObjEventData) {
        switch(eventData.eventType) {
            case ObjEventType.SelectionChanged:
                    
            break;
        }
    }
}