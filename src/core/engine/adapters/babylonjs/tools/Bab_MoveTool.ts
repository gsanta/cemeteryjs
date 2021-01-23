import { Mesh, PointerInfo } from "babylonjs";
import { IEngineTool } from "../../../IEngineTool";
import { Bab_EngineFacade } from "../Bab_EngineFacade";

export class Bab_MoveTool implements IEngineTool {
    private engineFacade: Bab_EngineFacade;

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