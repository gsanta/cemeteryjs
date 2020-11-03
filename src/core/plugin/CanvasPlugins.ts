import { AbstractCanvasPanel } from "./AbstractCanvasPanel";
import { IGizmoFactory } from "./IGizmo";


export class CanvasLookup {
    private gizmos: Map<string, IGizmoFactory> = new Map();
    private canvases: Map<string, AbstractCanvasPanel> = new Map();

    registerGizmo(id: string, gizmo: IGizmoFactory) {
        this.gizmos.set(id, gizmo);
    }

    getGizmoFactory(gizmoId: string): IGizmoFactory {
        return this.gizmos.get(gizmoId);
    }

    registerCanvas(canvas: AbstractCanvasPanel) {
        this.canvases.set(canvas.id, canvas);
    }

    getCanvas(id: string) {
        return this.canvases.get(id);
    }
}