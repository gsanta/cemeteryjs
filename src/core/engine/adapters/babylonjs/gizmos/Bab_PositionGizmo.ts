import { PositionGizmo, UtilityLayerRenderer } from "babylonjs";
import { MeshObj } from "../../../../models/objs/MeshObj";
import { IPositionGizmo } from "../../../gizmos/IPositionGizmo";
import { Bab_EngineFacade } from "../Bab_EngineFacade";

export const PositionGizmoType = 'position-gizmo';
export class Bab_AxisGizmo implements IPositionGizmo {
    private engineFacade: Bab_EngineFacade;
    gizmoType = PositionGizmoType;

    constructor(engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;
    }

    attachTo(meshObj: MeshObj) {
        const scene = this.engineFacade.scene;
        const meshData = this.engineFacade.meshes.meshes.get(meshObj);

        if (!meshData) { return; }

        const mesh = meshData[0];

        var utilLayer = new UtilityLayerRenderer(scene);

        var gizmo = new PositionGizmo(utilLayer);
        gizmo.attachedMesh = mesh;
    
        gizmo.updateGizmoRotationToMatchAttachedMesh = false;
        gizmo.updateGizmoPositionToMatchAttachedMesh = true;
    }
}