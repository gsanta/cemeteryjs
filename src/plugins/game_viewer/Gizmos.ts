import { Registry } from "../../core/Registry";
import { AxisGizmo } from "./AxisGizmo";
import { AbstractPlugin } from "../../core/AbstractPlugin";

export class Gizmos {
    private axisGizmo: AxisGizmo;

    constructor(plugin: AbstractPlugin, registry: Registry) {
        this.axisGizmo = new AxisGizmo(plugin, registry);
    }

    awake() {
        // this.axisGizmo.awake();
    }

    update() {
        this.axisGizmo.update();
    }
}