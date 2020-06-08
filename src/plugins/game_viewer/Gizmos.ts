import { Registry } from "../../core/Registry";
import { AxisGizmo } from "./AxisGizmo";

export class Gizmos {
    private axisGizmo: AxisGizmo;

    constructor(registry: Registry) {
        this.axisGizmo = new AxisGizmo(registry);
    }

    awake() {
        // this.axisGizmo.awake();
    }

    update() {
        this.axisGizmo.update();
    }
}