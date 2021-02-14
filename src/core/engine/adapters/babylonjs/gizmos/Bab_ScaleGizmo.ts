import { Mesh, ScaleGizmo, UtilityLayerRenderer } from "babylonjs";
import { CanvasEventType } from "../../../../models/CanvasObservable";
import { ObjEventType } from "../../../../models/ObjObservable";
import { AbstractGameObj } from "../../../../models/objs/AbstractGameObj";
import { MeshObjType, MeshObj } from "../../../../models/objs/MeshObj";
import { Registry } from "../../../../Registry";
import { Bab_EngineFacade } from "../Bab_EngineFacade";

export const ScaleGizmoType = 'scale-gizmo';
export class Bab_ScaleGizmo {
    private _engineFacade: Bab_EngineFacade;
    gizmoType = ScaleGizmoType;

    private _utilLayer: UtilityLayerRenderer;
    private _gizmo: ScaleGizmo;
    private _registry: Registry;
    private _mesh: Mesh;
    private _obj: MeshObj;

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this._registry = registry;
        this._engineFacade = engineFacade;
    }

    attachTo(obj: AbstractGameObj) {
        this._mesh = undefined;
        this._obj = <MeshObj> obj;

        if (obj.objType === MeshObjType) {
            this._mesh = this._engineFacade.meshes.getRootMesh(<MeshObj> obj);
        }

        if (this._mesh) {
            this._utilLayer = new UtilityLayerRenderer(this._engineFacade.scene);

            this._gizmo = new ScaleGizmo(this._utilLayer);
            this._gizmo.attachedMesh = this._mesh;
        
            this._gizmo.updateGizmoRotationToMatchAttachedMesh = false;
            this._gizmo.updateGizmoPositionToMatchAttachedMesh = true;

            this._gizmo.onDragEndObservable.add(() => this._dragEnd());
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

    private _dragEnd() {
        const meshObj = this._engineFacade.meshes.meshToObj.get(this._mesh);
        // gizmo manipulates mesh data directly not through obj, so we need to manually call the event
        this._obj.canvas.observable.emit({eventType: CanvasEventType.ScaleChanged})

    }
}