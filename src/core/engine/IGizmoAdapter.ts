import { GizmoType } from "../../modules/scene_editor/main/GizmoHandler";
import { Point } from "../../utils/geometry/shapes/Point";
import { AbstractGameObj } from "../models/objs/AbstractGameObj";


export interface IGizmoAdapter {
    showGizmo(gizmoType: string);
    setGizmoPosition(gizmoType: string, point: Point);

    applyGizmo(obj: AbstractGameObj, gizmoType: GizmoType);
    removeActiveGizmo();
}