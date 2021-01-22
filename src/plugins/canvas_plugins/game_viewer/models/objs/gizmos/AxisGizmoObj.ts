import { AxisGizmoType } from "../../../../../../core/engine/adapters/babylonjs/gizmos/AxisGizmo";
import { IAxisGizmo } from "../../../../../../core/engine/gizmos/IAxisGizmo";
import { IEngineFacade } from "../../../../../../core/engine/IEngineFacade";
import { Registry } from "../../../../../../core/Registry";
import { Point } from "../../../../../../utils/geometry/shapes/Point";


export class AxisGizmoObj {
    private engineFacade: IEngineFacade;

    constructor(engineFacade: IEngineFacade) {
        this.engineFacade = engineFacade;
    }

    setPosition(point: Point) {
        const gizmo = <IAxisGizmo> this.engineFacade.gizmos.getGizmo(AxisGizmoType);
        gizmo.setPosition(point);
    }

    show() {
        const gizmo = <IAxisGizmo> this.engineFacade.gizmos.getGizmo(AxisGizmoType);
        gizmo.show();
    }
}