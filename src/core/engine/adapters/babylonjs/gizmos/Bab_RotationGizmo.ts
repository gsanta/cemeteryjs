import { Mesh, RotationGizmo, UtilityLayerRenderer } from "babylonjs";
import { Bab_EngineFacade } from "../Bab_EngineFacade";

export const RotationGizmoType = 'rotation-gizmo';
export class Bab_RotationGizmo {
    private engineFacade: Bab_EngineFacade;
    gizmoType = RotationGizmoType;

    private utilLayer: UtilityLayerRenderer;
    private gizmo: RotationGizmo;

    constructor(engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;
    }

    attachTo(mesh: Mesh) {
        this.utilLayer = new UtilityLayerRenderer(this.engineFacade.scene);
        this.gizmo = new RotationGizmo(this.utilLayer);
        this.gizmo.attachedMesh = mesh;
    
        this.gizmo.updateGizmoRotationToMatchAttachedMesh = false;
        this.gizmo.updateGizmoPositionToMatchAttachedMesh = true;
    }

    detach() {
        if (this.utilLayer) {
            this.utilLayer.dispose();
        }

        if (this.gizmo) {
            this.gizmo.dispose();
        }
    }
}