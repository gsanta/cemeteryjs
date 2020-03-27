import { IViewExporter } from "./IViewExporter";
import { Stores } from "../../stores/Stores";
import { CanvasView } from "../../views/canvas/CanvasView";
import { Camera } from "../../views/canvas/models/Camera";
import * as React from 'react';

export class CanvasViewExporter implements IViewExporter {
    private getStores: () => Stores;

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
    }


    export(): JSX.Element {
        const canvasView = this.getStores().viewStore.getViewById(CanvasView.id);

        return (
            <g
                data-view-type={CanvasView.id}
                data-zoom={(canvasView.getCamera() as Camera).getScale()}
                data-translate={(canvasView.getCamera() as Camera).getViewBox().topLeft.toString()}
            />
        )
    }
}