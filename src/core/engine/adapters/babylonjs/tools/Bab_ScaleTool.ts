import { Mesh, PointerInfo } from "babylonjs";
import { IEngineTool } from "../../../IEngineTool";
import { Bab_EngineFacade } from "../Bab_EngineFacade";
import { Bab_ScaleGizmo } from "../gizmos/Bab_ScaleGizmo";

export const _3DScaleTool = '_3d-scale-tool';

export class Bab_ScaleTool implements IEngineTool {
    private engineFacade: Bab_EngineFacade;
    toolType = _3DScaleTool;
    private scaleGizmo: Bab_ScaleGizmo;

    constructor(engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;

        this.scaleGizmo = new Bab_ScaleGizmo(this.engineFacade);
    }

    up(pointerInfo: PointerInfo) {
        this.scaleGizmo.detach();

        const pickedMesh = <Mesh> pointerInfo.pickInfo.pickedMesh 

        if (pickedMesh && this.engineFacade.meshes.hasMesh(pickedMesh)) {
            this.scaleGizmo.attachTo(<Mesh> pointerInfo.pickInfo.pickedMesh);
        }
    }

    deselect() {
        this.scaleGizmo.detach();
    }
}