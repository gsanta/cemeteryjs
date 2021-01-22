import { AxisGizmoType } from "../../../core/engine/adapters/babylonjs/gizmos/AxisGizmo";
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

        this.registry.engine.onReady(() => {
            const axisGizmo = <IAxisGizmo> this.registry.engine.gizmos.getGizmo(AxisGizmoType);
            axisGizmo.show();
        });
    }
}