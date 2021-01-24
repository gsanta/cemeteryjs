import { Mesh, PointerInfo } from "babylonjs";
import { ObjEventType } from "../../../../models/ObjObservable";
import { Registry } from "../../../../Registry";
import { IEngineTool } from "../../../IEngineTool";
import { Bab_EngineFacade } from "../Bab_EngineFacade";
import { Bab_ScaleGizmo } from "../gizmos/Bab_ScaleGizmo";

export const _3DScaleTool = '_3d-scale-tool';

export class Bab_ScaleTool implements IEngineTool {
    private engineFacade: Bab_EngineFacade;
    toolType = _3DScaleTool;
    private scaleGizmo: Bab_ScaleGizmo;
    private pickedMesh: Mesh;
    private registry: Registry;

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;
        this.registry = registry;

        this.scaleGizmo = new Bab_ScaleGizmo(this.engineFacade);
        this.scaleGizmo.onDrag(() => this.emitScaleEvent());
    }

    up(pointerInfo: PointerInfo) {
        this.scaleGizmo.detach();
        this.pickedMesh = undefined;

        const pickedMesh = <Mesh> pointerInfo.pickInfo.pickedMesh 

        if (pickedMesh && this.engineFacade.meshes.hasMesh(pickedMesh)) {
            this.pickedMesh = pickedMesh;
            this.scaleGizmo.attachTo(<Mesh> pointerInfo.pickInfo.pickedMesh);
        }
    }

    deselect() {
        this.pickedMesh = undefined;
        this.scaleGizmo.detach();
    }

    private emitScaleEvent() {
        if (this.pickedMesh) {
            const meshObj = this.engineFacade.meshes.meshToObj.get(this.pickedMesh);
            this.registry.data.scene.observable.emit({ obj: meshObj, eventType: ObjEventType.ScaleChanged });
        }
    }
}