import { IGizmoAdapter } from "../../IGizmoAdapter";
import { Bab_EngineFacade } from "./Bab_EngineFacade";
import { IBabylonGizmo } from "./gizmos/IBabylonGizmo";

export class Bab_GizmoAdapter implements IGizmoAdapter {
    private engineFacade: Bab_EngineFacade;
    private gizmos: Map<string, IBabylonGizmo> = new Map();

    constructor(engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;
    }
    getGizmo(gizmoType: string) {
        return this.gizmos.get(gizmoType);
    }

    registerGizmo(gizmo: IBabylonGizmo) {
        this.gizmos.set(gizmo.gizmoType, gizmo);
    }
}