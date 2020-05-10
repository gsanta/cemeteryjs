import { IViewImporter } from "./IViewImporter";
import { CanvasView } from "../../../plugins/scene_editor/CanvasView";
import { Stores } from "../../stores/Stores";
import { Point } from "../../geometry/shapes/Point";
import { Camera2D } from "../../../plugins/common/camera/Camera2D";
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
        this.registry.services.layout.getViewById(CanvasView.id);

        if (json._attributes['data-translate']) {
            const topLeft = Point.fromString(json._attributes['data-translate']);
            const camera = <Camera2D> this.registry.services.layout.getViewById(CanvasView.id).getCamera();
            // implement later
        }        
    }
}