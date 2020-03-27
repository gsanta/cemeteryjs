import { IViewImporter } from "./IViewImporter";
import { CanvasView } from "../../views/canvas/CanvasView";
import { Stores } from "../../stores/Stores";
import { Point } from "../../../misc/geometry/shapes/Point";
import { Camera } from "../../views/canvas/models/Camera";

export interface CanvasViewJson {
    _attributes: {
        "data-view-type": string;
        "data-zoom": string;
        "data-translate": string;
    }
}

export class CanvasViewImporter implements IViewImporter {
    viewType = CanvasView.id;
    private getStores: () => Stores

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
    }

    import(json: CanvasViewJson): void {
        this.getStores().viewStore.getViewById(CanvasView.id);

        if (json._attributes['data-translate']) {
            const topLeft = Point.fromString(json._attributes['data-translate']);
            const camera = <Camera> this.getStores().viewStore.getViewById(CanvasView.id).getCamera();
            camera.moveTo(topLeft);
        }        
        const zoom = json._attributes['data-zoom'] ? parseFloat(json._attributes['data-zoom']) : 1;
        const camera = <Camera> this.getStores().viewStore.getViewById(CanvasView.id).getCamera();
        camera.zoom(zoom);
    }
}