import { IGizmoFactory } from "../plugin/IGizmo";


export class GizmoService {
    private gizmos: Map<string, IGizmoFactory> = new Map();

    registerGizmo(id: string, gizmo: IGizmoFactory) {
        this.gizmos.set(id, gizmo);
    }
}