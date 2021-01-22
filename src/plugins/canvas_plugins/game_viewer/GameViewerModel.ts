import { AxisGizmoType } from "../../../core/engine/adapters/babylonjs/gizmos/Bab_AxisGizmo";
import { IAxisGizmo } from "../../../core/engine/gizmos/IAxisGizmo";
import { Registry } from "../../../core/Registry";
import { AxisGizmoObj } from "./models/objs/gizmos/AxisGizmoObj";


export class GameViewerModel {
    showBoundingBoxes: boolean = false;
    axisGizmoObj: AxisGizmoObj;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;

        this.axisGizmoObj = new AxisGizmoObj(this.registry.engine);
    }
}