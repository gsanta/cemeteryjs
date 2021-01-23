import { Point } from "../../utils/geometry/shapes/Point";
import { IGizmoObj } from "../models/objs/IGizmoObj";


export interface IGizmoAdapter {
    showGizmo(gizmoType: string);
    setGizmoPosition(gizmoType: string, point: Point);
}