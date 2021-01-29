import { Mesh, Observer } from "babylonjs";
import { Bab_EngineFacade } from "../Bab_EngineFacade";

export const PositionGizmoType = 'position-gizmo';
export class Bab_PositionGizmo {
    private engineFacade: Bab_EngineFacade;
    gizmoType = PositionGizmoType;

    private onDragEndFuncs: (() => void)[] = [];
    private onDragFuncs: (() => void)[] = [];
    private dragIntervalToken: any;
    private dragStartObserver: Observer<any>;
    private dragEndObserver: Observer<any>;

    constructor(engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;
        this.dragStart.bind(this);
        this.dragEnd.bind(this);
    }

    attachTo(mesh: Mesh) {
        const gizmoManager = this.engineFacade.gizmos.gizmoManager;
        gizmoManager.positionGizmoEnabled = true;
        gizmoManager.attachToMesh(mesh);
    
        this.dragStartObserver = gizmoManager.gizmos.positionGizmo.onDragStartObservable.add(() => this.dragStart());
        this.dragEndObserver = gizmoManager.gizmos.positionGizmo.onDragEndObservable.add(() => this.dragEnd());
    }

    disable() {
        const gizmoManager = this.engineFacade.gizmos.gizmoManager;
        gizmoManager.gizmos.positionGizmo.xGizmo.dragBehavior.enabled = false;
    }

    enable() {
        const gizmoManager = this.engineFacade.gizmos.gizmoManager;
        gizmoManager.gizmos.positionGizmo.xGizmo.dragBehavior.enabled = true;
    }

    detach() {
        const gizmoManager = this.engineFacade.gizmos.gizmoManager;
        gizmoManager.positionGizmoEnabled = false;

        if (this.dragStartObserver) {
            gizmoManager.gizmos.positionGizmo.onDragStartObservable.remove(this.dragStartObserver);
        }

        if (this.dragEndObserver) {
            gizmoManager.gizmos.positionGizmo.onDragStartObservable.remove(this.dragEndObserver);
        }

        this.dragStartObserver = undefined;
        this.dragEndObserver = undefined;
    }

    onDrag(callback: () => void) {
        this.onDragFuncs.push(callback);
    }

    onDragEnd(callback: () => void) {
        this.onDragEndFuncs.push(callback);
    }

    offDragEnd(callback: () => void) {
        this.onDragEndFuncs = this.onDragEndFuncs.filter(func => func !== callback);
    }

    private dragStart() {
        this.dragIntervalToken = setInterval(() => this.emitDrag(), 50);
    }

    private dragEnd() {
        clearTimeout(this.dragIntervalToken);
        this.onDragEndFuncs.forEach(func => func());
    }

    private emitDrag() {
        this.onDragFuncs.forEach(func => func());
    }
}