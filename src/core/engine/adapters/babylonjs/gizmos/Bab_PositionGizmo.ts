import { Mesh, PositionGizmo, UtilityLayerRenderer } from "babylonjs";
import { Bab_EngineFacade } from "../Bab_EngineFacade";

export const PositionGizmoType = 'position-gizmo';
export class Bab_PositionGizmo {
    private engineFacade: Bab_EngineFacade;
    gizmoType = PositionGizmoType;

    private utilLayer: UtilityLayerRenderer;
    private gizmo: PositionGizmo;

    constructor(engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;
    }

    attachTo(mesh: Mesh) {
        this.utilLayer = new UtilityLayerRenderer(this.engineFacade.scene);

        this.gizmo = new PositionGizmo(this.utilLayer);
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