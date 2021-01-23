import { Mesh, PointerInfo } from "babylonjs";
import { IEngineTool } from "../../../IEngineTool";
import { Bab_EngineFacade } from "../Bab_EngineFacade";

export const _3DScaleTool = '_3d-scale-tool';

export class Bab_ScaleTool implements IEngineTool {
    private engineFacade: Bab_EngineFacade;
    toolType = _3DScaleTool;

    constructor(engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;
    }

    up(pointerInfo: PointerInfo) {
        const positionGizmo = this.engineFacade.gizmos.scaleGizmo;

        if (pointerInfo.pickInfo.pickedMesh) {
            positionGizmo.attachTo(<Mesh> pointerInfo.pickInfo.pickedMesh);
        }
    }
}