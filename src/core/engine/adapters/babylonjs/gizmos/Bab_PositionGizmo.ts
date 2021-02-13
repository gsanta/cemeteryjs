import { Mesh, Observer } from "babylonjs";
import { SceneEditorPanelId } from "../../../../../modules/scene_editor/main/SceneEditorModule";
import { AbstractCanvasPanel } from "../../../../models/modules/AbstractCanvasPanel";
import { AbstractGameObj } from "../../../../models/objs/AbstractGameObj";
import { IObj } from "../../../../models/objs/IObj";
import { MeshObj, MeshObjType } from "../../../../models/objs/MeshObj";
import { Registry } from "../../../../Registry";
import { IGizmo } from "../../../IGizmo";
import { Bab_EngineFacade } from "../Bab_EngineFacade";
import { MeshSnapper } from "../mesh/MeshSnapper";

export const PositionGizmoType = 'position-gizmo';
export class Bab_PositionGizmo implements IGizmo {
    private _engineFacade: Bab_EngineFacade;
    gizmoType = PositionGizmoType;

    private _dragIntervalToken: any;
    private _dragStartObserver: Observer<any>;
    private _dragEndObserver: Observer<any>;
    private _registry: Registry;
    private _meshSnapper: MeshSnapper;
    private _obj: MeshObj;

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this._registry = registry;
        this._engineFacade = engineFacade;
        this.dragStart.bind(this);
        this.dragEnd.bind(this);
    }

    attachTo(obj: AbstractGameObj) {
        this._obj = <MeshObj> obj;
        let mesh: Mesh;

        if (obj.objType === MeshObjType) {
            mesh = this._engineFacade.meshes.getRootMesh(<MeshObj> obj);
        }

        if (mesh) {
            const gizmoManager = this._engineFacade.gizmos.gizmoManager;
            gizmoManager.positionGizmoEnabled = true;
            gizmoManager.attachToMesh(mesh);
        
            this._dragStartObserver = gizmoManager.gizmos.positionGizmo.onDragStartObservable.add(() => this.dragStart());
            this._dragEndObserver = gizmoManager.gizmos.positionGizmo.onDragEndObservable.add(() => this.dragEnd());
        }
    }

    disable() {
        const gizmoManager = this._engineFacade.gizmos.gizmoManager;
        gizmoManager.gizmos.positionGizmo.xGizmo.dragBehavior.enabled = false;
    }

    enable() {
        const gizmoManager = this._engineFacade.gizmos.gizmoManager;
        gizmoManager.gizmos.positionGizmo.xGizmo.dragBehavior.enabled = true;
    }

    detach() {
        const gizmoManager = this._engineFacade.gizmos.gizmoManager;
        gizmoManager.positionGizmoEnabled = false;

        if (this._dragStartObserver) {
            gizmoManager.gizmos.positionGizmo.onDragStartObservable.remove(this._dragStartObserver);
        }

        if (this._dragEndObserver) {
            gizmoManager.gizmos.positionGizmo.onDragStartObservable.remove(this._dragEndObserver);
        }

        this._dragStartObserver = undefined;
        this._dragEndObserver = undefined;
    }

    private dragStart() {
        this._dragIntervalToken = setInterval(() => this.emitDrag(), 50);
    }

    private dragEnd() {
        clearTimeout(this._dragIntervalToken);
    }

    private emitDrag() {
        const canvas: AbstractCanvasPanel<IObj> = this._registry.services.module.ui.getCanvas(SceneEditorPanelId);
        const pointerTracker = canvas.pointer.pointer;
        const snapChanged = this._meshSnapper.trySnapOrUnsnap(this._obj, pointerTracker);

        if (snapChanged) {
            if (this._meshSnapper.isSnapped()) {
                this.disable();
            } else {
                this.enable();
            }
        }
    }
}