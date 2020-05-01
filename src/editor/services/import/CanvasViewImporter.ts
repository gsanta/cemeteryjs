import { IViewImporter } from "./IViewImporter";
import { CanvasView } from "../../views/canvas/CanvasView";
import { Stores } from "../../stores/Stores";
import { Point } from "../../../misc/geometry/shapes/Point";
import { CanvasCamera } from "../../views/canvas/CanvasCamera";
import { Registry } from "../../Registry";

export interface CanvasViewJson {
    _attributes: {
        "data-view-type": string;
        "data-zoom": string;
        "data-translate": string;
    }
}

export class CanvasViewImporter implements IViewImporter {
    viewType = CanvasView.id;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    import(json: CanvasViewJson): void {
        this.registry.stores.viewStore.getViewById(CanvasView.id);

        if (json._attributes['data-translate']) {
            const topLeft = Point.fromString(json._attributes['data-translate']);
            const camera = <CanvasCamera> this.registry.stores.viewStore.getViewById(CanvasView.id).getCamera();
            // implement later
        }        
    }
}