import { PositionGizmo } from "babylonjs";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { IGizmoAdapter } from "../../IGizmoAdapter";
import { Bab_EngineFacade } from "./Bab_EngineFacade";
import { Bab_PositionGizmo } from "./gizmos/Bab_PositionGizmo";
import { Bab_RotationGizmo } from "./gizmos/Bab_RotationGizmo";
import { Bab_ScaleGizmo } from "./gizmos/Bab_ScaleGizmo";
import { IBabylonGizmo } from "./gizmos/IBabylonGizmo";

export class Bab_GizmoAdapter implements IGizmoAdapter {
    private engineFacade: Bab_EngineFacade;
    private gizmos: Map<string, IBabylonGizmo> = new Map();

    positionGizmo: Bab_PositionGizmo;
    scaleGizmo: Bab_ScaleGizmo;
    rotationGizmo: Bab_RotationGizmo;

    constructor(engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;
    }

    showGizmo(gizmoType: string) {
        this.gizmos.get(gizmoType).show();
    }

    setGizmoPosition(gizmoType: string, point: Point) {
        this.gizmos.get(gizmoType).setPosition(point);
    }

    registerGizmo(gizmo: IBabylonGizmo) {
        this.gizmos.set(gizmo.gizmoType, gizmo);
    }
}