import { Mesh, PointerInfo } from "babylonjs";
import { IEngineTool } from "../../../IEngineTool";
import { Bab_EngineFacade } from "../Bab_EngineFacade";
import { Bab_PositionGizmo } from "../gizmos/Bab_PositionGizmo";

export const _3DMoveTool = '_3d-move-tool';
export class Bab_MoveTool implements IEngineTool {
    private engineFacade: Bab_EngineFacade;
    toolType = _3DMoveTool;
    private positionGizmo: Bab_PositionGizmo;

    constructor(engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;

        this.positionGizmo = new Bab_PositionGizmo(this.engineFacade);
    }

    up(pointerInfo: PointerInfo) {
        this.positionGizmo.detach();

        const pickedMesh = <Mesh> pointerInfo.pickInfo.pickedMesh 

        if (pickedMesh && this.engineFacade.meshes.hasMesh(pickedMesh)) {
            this.positionGizmo.attachTo(<Mesh> pointerInfo.pickInfo.pickedMesh);
        }
    }

    deselect() {
        this.positionGizmo.detach();
    }
}