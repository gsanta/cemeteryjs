import { Mesh, PointerInfo } from "babylonjs";
import { ObjEventType } from "../../../../models/ObjObservable";
import { MeshObj } from "../../../../models/objs/MeshObj";
import { Registry } from "../../../../Registry";
import { IEngineTool } from "../../../IEngineTool";
import { Bab_EngineFacade } from "../Bab_EngineFacade";
import { Bab_PositionGizmo } from "../gizmos/Bab_PositionGizmo";
import { MeshSnapper } from "../mesh/MeshSnapper";

export const _3DMoveTool = '_3d-move-tool';
export class Bab_MoveTool implements IEngineTool {
    private engineFacade: Bab_EngineFacade;
    toolType = _3DMoveTool;
    private positionGizmo: Bab_PositionGizmo;
    private pickedMesh: Mesh;
    private pickedMeshObj: MeshObj;
    private registry: Registry;
    private meshSnapper: MeshSnapper;

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;
        this.registry = registry;
        this.meshSnapper = new MeshSnapper(registry);

        this.positionGizmo = new Bab_PositionGizmo(this.engineFacade);
        this.positionGizmo.onDragEnd(() => this.emitMoveEvent());
        this.positionGizmo.onDrag(() => {
            const pointerTracker = registry.services.pointer.pointer;
            const snapChanged = this.meshSnapper.trySnapOrUnsnap(this.pickedMeshObj, pointerTracker);

            if (snapChanged) {
                if (this.meshSnapper.isSnapped()) {
                    this.positionGizmo.disable();
                } else {
                    this.positionGizmo.enable();
                }
            }
        });
    }

    up(pointerInfo: PointerInfo) {
        this.deselect();

        const pickedMesh = <Mesh> pointerInfo.pickInfo.pickedMesh 

        if (pickedMesh && this.engineFacade.meshes.hasMesh(pickedMesh)) {
            this.pickedMesh = pickedMesh;
            this.pickedMeshObj = this.engineFacade.meshes.meshToObj.get(this.pickedMesh);
            this.positionGizmo.attachTo(<Mesh> pointerInfo.pickInfo.pickedMesh);
        }
    }

    deselect() {
        this.pickedMesh = undefined;
        this.pickedMeshObj = undefined;
        this.positionGizmo.detach();
    }

    private emitMoveEvent() {
        if (this.pickedMesh) {
            this.registry.data.scene.observable.emit({ obj: this.pickedMeshObj, eventType: ObjEventType.PositionChanged });
        }
    }
}