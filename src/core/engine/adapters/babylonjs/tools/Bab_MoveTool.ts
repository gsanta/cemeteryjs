import { Mesh, PointerInfo } from "babylonjs";
import { IEngineTool } from "../../../IEngineTool";
import { Bab_EngineFacade } from "../Bab_EngineFacade";

export const _3DMoveTool = '_3d-move-tool';
export class Bab_MoveTool implements IEngineTool {
    private engineFacade: Bab_EngineFacade;
    toolType = _3DMoveTool;

    constructor(engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;
    }

    up(pointerInfo: PointerInfo) {
        const positionGizmo = this.engineFacade.gizmos.positionGizmo;

        if (pointerInfo.pickInfo.pickedMesh) {
            positionGizmo.attachTo(<Mesh> pointerInfo.pickInfo.pickedMesh);
        }
    }
}