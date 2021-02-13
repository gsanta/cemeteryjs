import { CanvasEventData, CanvasEventType } from "../../../core/models/CanvasObservable";
import { Canvas3dPanel } from "../../../core/models/modules/Canvas3dPanel";

export enum GizmoType {
    Position = 'Position',
    Rotation = 'Rotation',
    Scale = 'Scale'
}

export class GizmoHandler {
    private gizmoType: GizmoType;
    private canvas: Canvas3dPanel;

    constructor(canvas: Canvas3dPanel) {
        this.canvas = canvas;

        canvas.observable.add(eventData => this.observer(eventData));
    }
    
    setSelectedGizmo(gizmoType: GizmoType) {
        this.gizmoType = gizmoType;
        this.updateGizmo();
    }

    getSelectedGizmo(): GizmoType {
        return this.gizmoType;
    }

    private observer(eventData: CanvasEventData) {
        if(eventData.eventType === CanvasEventType.TagChanged) {
            this.updateGizmo();
        }
    }

    private updateGizmo() {
        const selectedItems = this.canvas.data.items.getAllItems().filter(item => item.hasTag('select'));

        if (selectedItems.length === 1 && this.getSelectedGizmo()) {
            this.canvas.engine.gizmos.applyGizmo(selectedItems[0], this.getSelectedGizmo());
        } else {
            this.canvas.engine.gizmos.removeActiveGizmo();
        }
    }
}