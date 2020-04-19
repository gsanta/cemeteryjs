import { IViewImporter } from "./IViewImporter";
import { CanvasView } from "../../views/canvas/CanvasView";
import { Stores } from "../../stores/Stores";
import { Point } from "../../../misc/geometry/shapes/Point";
import { CanvasCamera } from "../../views/canvas/CanvasCamera";

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
            const camera = <CanvasCamera> this.getStores().viewStore.getViewById(CanvasView.id).getCamera();
            const zoom = json._attributes['data-zoom'] ? parseFloat(json._attributes['data-zoom']) : 1;
            camera.zoom(zoom);
            camera.moveTo(topLeft);
        }        
    }
}