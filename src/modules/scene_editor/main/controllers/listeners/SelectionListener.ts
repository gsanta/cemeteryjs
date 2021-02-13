import { CanvasEventData, CanvasEventType } from "../../../../../core/models/CanvasObservable";
import { AbstractGameObj } from "../../../../../core/models/objs/AbstractGameObj";
import { SceneEditorModule } from "../../SceneEditorModule";


export class SelectionListener {
    private _canvas: SceneEditorModule;

    constructor(canvas: SceneEditorModule) {
        this._canvas = canvas;
    }

    listen() {
        this._canvas.observable.add((eventData) => this._observer(eventData));
    }

    private _observer(eventData: CanvasEventData) {
        switch(eventData.eventType) {
            case CanvasEventType.SelectionChanged:
                this.handleTagChanged(eventData.obj);
            break;
            case CanvasEventType.TagChanged:
                this.handleTagChanged(eventData.obj);
            break;
        }
    }

    private handleTagChanged(obj: AbstractGameObj) {
        if (obj.hasTag('hover') || obj.hasTag('select')) {
            obj.setBoundingBoxVisibility(true);
        } else {
            obj.setBoundingBoxVisibility(false);
        }

        // const gameObjs = <AbstractGameObj[]> this._canvas.data.items.getAllItems().filter(item => (<AbstractGameObj> item).setBoundingBoxVisibility);


        // gameObjs.forEach(gameObj => {
        //     gameObj.getAllTags();
        //     this._canvas.data.tags.get

        // })
        // this._canvas.data.items.getAllItems().forEach(item => {
        //     if ((<IGameObj> item).setBoundingBoxVisibility) {
        //         (<IGameObj> item).setBoundingBoxVisibility(false);
        //     }
        // });

        // this._canvas.data.selection.getAllItems().forEach((item: IGameObj) => {
        //     item.setBoundingBoxVisibility(true);
        // });
    }
}