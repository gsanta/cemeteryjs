import { Mesh, PointerInfo } from "babylonjs";
import { ObjEventType } from "../../../../models/ObjObservable";
import { Registry } from "../../../../Registry";
import { IEngineTool } from "../../../IEngineTool";
import { Bab_EngineFacade } from "../Bab_EngineFacade";
import { Bab_RotationGizmo } from "../gizmos/Bab_RotationGizmo";

export const _3DRotationTool = '_3d-rotation-tool';

export class Bab_RotationTool implements IEngineTool {
    private engineFacade: Bab_EngineFacade;
    toolType = _3DRotationTool;
    private rotationGizmo: Bab_RotationGizmo;
    private pickedMesh: Mesh;
    private registry: Registry;

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;
        this.registry = registry;

        this.rotationGizmo = new Bab_RotationGizmo(this.engineFacade);
        this.rotationGizmo.onDrag(() => this.emitRotationEvent());
    }

    up(pointerInfo: PointerInfo) {
        this.rotationGizmo.detach();
        this.pickedMesh = undefined;

        const pickedMesh = <Mesh> pointerInfo.pickInfo.pickedMesh 
        if (pickedMesh && this.engineFacade.meshes.hasMesh(pickedMesh)) {
            this.pickedMesh = pickedMesh;
            this.rotationGizmo.attachTo(<Mesh> pointerInfo.pickInfo.pickedMesh);
        }
    }
    
    deselect() {
        this.pickedMesh = undefined;
        this.rotationGizmo.detach();
    }

    private emitRotationEvent() {
        if (this.pickedMesh) {
            const meshObj = this.engineFacade.meshes.meshToObj.get(this.pickedMesh);
            this.registry.data.observable.emit({ obj: meshObj, eventType: ObjEventType.RotationChanged });
        }
    }
}