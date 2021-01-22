import { IGizmoObj } from "../models/objs/IGizmoObj";


export interface IGizmoAdapter {
    getGizmo(gizmoType: string);
}