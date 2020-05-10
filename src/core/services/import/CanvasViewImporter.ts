import { IViewImporter } from "./IViewImporter";
import { CanvasView } from "../../../plugins/scene_editor/CanvasView";
import { Stores } from "../../stores/Stores";
import { Point } from "../../../misc/geometry/shapes/Point";
import { CanvasCamera } from "../../../plugins/scene_editor/CanvasCamera";
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
        this.registry.services.view.getViewById(CanvasView.id);

        if (json._attributes['data-translate']) {
            const topLeft = Point.fromString(json._attributes['data-translate']);
            const camera = <CanvasCamera> this.registry.services.view.getViewById(CanvasView.id).getCamera();
            // implement later
        }        
    }
}