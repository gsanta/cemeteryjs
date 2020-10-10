import { Registry } from "../../../core/Registry";
import { AxisGizmo } from "../../canvas/gizmos/axis_gizmo/AxisGizmo";
import { AbstractCanvasPlugin } from "../../../core/plugin/AbstractCanvasPlugin";

export class Gizmos {
    private axisGizmo: AxisGizmo;

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        this.axisGizmo = new AxisGizmo(plugin, registry);
    }

    awake() {
        // this.axisGizmo.awake();
    }

    update() {
        this.axisGizmo.update();
    }
}