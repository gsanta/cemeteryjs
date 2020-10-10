import { IGizmoFactory } from "./IGizmo";


export class CanvasPlugins {
    private gizmos: Map<string, IGizmoFactory> = new Map();

    registerGizmo(id: string, gizmo: IGizmoFactory) {
        this.gizmos.set(id, gizmo);
    }

    getGizmoFactory(gizmoId: string): IGizmoFactory {
        return this.gizmos.get(gizmoId);
    }
}