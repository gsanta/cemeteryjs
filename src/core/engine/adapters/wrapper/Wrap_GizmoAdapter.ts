import { Point } from "../../../../utils/geometry/shapes/Point";
import { IGizmoAdapter } from "../../IGizmoAdapter";
import { Wrap_EngineFacade } from "./Wrap_EngineFacade";

export class Wrap_GizmoAdapter implements IGizmoAdapter {
    private engineFacade: Wrap_EngineFacade;

    constructor(engineFacade: Wrap_EngineFacade) {
        this.engineFacade = engineFacade;
    }

    showGizmo(gizmoType: string) {
        this.engineFacade.realEngine.gizmos.showGizmo(gizmoType);
    }

    setGizmoPosition(gizmoType: string, point: Point) {
        this.engineFacade.realEngine.gizmos.setGizmoPosition(gizmoType, point);
    }
}