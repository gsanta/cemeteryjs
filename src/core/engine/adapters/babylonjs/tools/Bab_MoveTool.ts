import { Mesh, PointerInfo } from "babylonjs";
import { ObjEventType } from "../../../../models/ObjObservable";
import { Registry } from "../../../../Registry";
import { IEngineTool } from "../../../IEngineTool";
import { Bab_EngineFacade } from "../Bab_EngineFacade";
import { Bab_PositionGizmo } from "../gizmos/Bab_PositionGizmo";

export const _3DMoveTool = '_3d-move-tool';
export class Bab_MoveTool implements IEngineTool {
    private engineFacade: Bab_EngineFacade;
    toolType = _3DMoveTool;
    private positionGizmo: Bab_PositionGizmo;
    private pickedMesh: Mesh;
    private registry: Registry;

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;
        this.registry = registry;

        this.positionGizmo = new Bab_PositionGizmo(this.engineFacade);
        this.positionGizmo.onDrag(() => this.emitMoveEvent());
    }

    up(pointerInfo: PointerInfo) {
        this.positionGizmo.detach();
        this.pickedMesh = undefined;

        const pickedMesh = <Mesh> pointerInfo.pickInfo.pickedMesh 

        if (pickedMesh && this.engineFacade.meshes.hasMesh(pickedMesh)) {
            this.pickedMesh = pickedMesh;
            this.positionGizmo.attachTo(<Mesh> pointerInfo.pickInfo.pickedMesh);
        }
    }

    deselect() {
        this.pickedMesh = undefined;
        this.positionGizmo.detach();
    }

    private emitMoveEvent() {
        if (this.pickedMesh) {
            const meshObj = this.engineFacade.meshes.meshToObj.get(this.pickedMesh);
            this.registry.data.scene.observable.emit({ obj: meshObj, eventType: ObjEventType.PositionChanged });
        }
    }
}