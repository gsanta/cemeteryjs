import { Mesh, PointerInfo } from "babylonjs";
import { IEngineTool } from "../../../IEngineTool";
import { Bab_EngineFacade } from "../Bab_EngineFacade";
import { Bab_RotationGizmo } from "../gizmos/Bab_RotationGizmo";

export const _3DRotationTool = '_3d-rotation-tool';

export class Bab_RotationTool implements IEngineTool {
    private engineFacade: Bab_EngineFacade;
    toolType = _3DRotationTool;
    private rotationGizmo: Bab_RotationGizmo;

    constructor(engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;

        this.rotationGizmo = new Bab_RotationGizmo(this.engineFacade);
    }

    up(pointerInfo: PointerInfo) {
        this.rotationGizmo.detach();

        const pickedMesh = <Mesh> pointerInfo.pickInfo.pickedMesh 
        if (pickedMesh && this.engineFacade.meshes.hasMesh(pickedMesh)) {
            this.rotationGizmo.attachTo(<Mesh> pointerInfo.pickInfo.pickedMesh);
        }
    }
    
    deselect() {
        this.rotationGizmo.detach();
    }
}