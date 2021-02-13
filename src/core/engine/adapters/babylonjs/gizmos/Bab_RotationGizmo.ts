import { Mesh, RotationGizmo, UtilityLayerRenderer } from "babylonjs";
import { ObjEventType } from "../../../../models/ObjObservable";
import { AbstractGameObj } from "../../../../models/objs/AbstractGameObj";
import { MeshObj, MeshObjType } from "../../../../models/objs/MeshObj";
import { Registry } from "../../../../Registry";
import { IGizmo } from "../../../IGizmo";
import { Bab_EngineFacade } from "../Bab_EngineFacade";

export const RotationGizmoType = 'rotation-gizmo';
export class Bab_RotationGizmo implements IGizmo {
    private engineFacade: Bab_EngineFacade;
    gizmoType = RotationGizmoType;

    private _utilLayer: UtilityLayerRenderer;
    private _gizmo: RotationGizmo;
    private _registry: Registry;
    private _mesh: Mesh;

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this._registry = registry;
        this.engineFacade = engineFacade;
    }

    attachTo(obj: AbstractGameObj) {
        this._mesh = undefined;

        if (obj.objType === MeshObjType) {
            this._mesh = this.engineFacade.meshes.getRootMesh(<MeshObj> obj);
        }

        if (this._mesh) {
            this._utilLayer = new UtilityLayerRenderer(this.engineFacade.scene);
            this._gizmo = new RotationGizmo(this._utilLayer);
            this._gizmo.attachedMesh = this._mesh;
        
            this._gizmo.updateGizmoRotationToMatchAttachedMesh = false;
            this._gizmo.updateGizmoPositionToMatchAttachedMesh = true;

            this._gizmo.onDragEndObservable.add(() => this.dragEnd());
        }
    }

    detach() {
        if (this._utilLayer) {
            this._utilLayer.dispose();
        }

        if (this._gizmo) {
            this._gizmo.dispose();
        }
    }

    private dragEnd() {
        const meshObj = this.engineFacade.meshes.meshToObj.get(this._mesh);
        this._registry.data.observable.emit({ obj: meshObj, eventType: ObjEventType.RotationChanged });
    }
}