import { IGizmoAdapter } from "../../IGizmoAdapter";
import { Wrap_EngineFacade } from "./Wrap_EngineFacade";

export class Wrap_GizmoAdapter implements IGizmoAdapter {
    private engineFacade: Wrap_EngineFacade;

    constructor(engineFacade: Wrap_EngineFacade) {
        this.engineFacade = engineFacade;
    }

    getGizmo(gizmoType: string) {
        return this.engineFacade.realEngine.gizmos.getGizmo(gizmoType);
    }
}