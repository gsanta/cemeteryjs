import { Registry } from '../../Registry';
import { IPointerEvent } from '../../services/input/PointerService';
import { getIntersectingViews, ShapeStore } from '../../stores/ShapeStore';
import { AbstractCanvasPanel } from '../AbstractCanvasPanel';
import { UI_Region } from '../UI_Panel';
import { createRectFromMousePointer } from './ToolAdapter';
import { PointerTool } from './PointerTool';
import { Cursor } from "./Tool";

export const SelectToolId = 'select-tool';
export class SelectTool extends PointerTool {

    constructor(canvas: AbstractCanvasPanel, store: ShapeStore, registry: Registry) {
        super(SelectToolId, canvas, store, registry);
    }

    down() {
        if (this.canvas.pointer.hoveredView && this.canvas.pointer.hoveredView.isSelected()) {
            super.down();
        }
    }

    click() {
        if (this.canvas.pointer.hoveredView) {
            super.click();
        } else if (this.viewStore.getSelectedShapes().length > 0) {
            this.viewStore.clearSelection();
            this.registry.services.render.scheduleRendering(this.canvas.region, UI_Region.Sidepanel);
        }
    }

    drag(e: IPointerEvent) {
        if (this.movingItem) {
            super.drag(e);
        } else {
            this.rectangleSelection = createRectFromMousePointer(this.canvas.pointer.pointer);
            this.registry.services.render.scheduleRendering(this.canvas.region);
        }
    }

    draggedUp() {
        if (this.movingItem) {
            super.draggedUp();
        } else {
            if (!this.rectangleSelection) { return }
    
            const intersectingViews = getIntersectingViews(this.viewStore, this.rectangleSelection);
            
            this.viewStore.clearSelection();
            this.viewStore.addSelectedShape(...intersectingViews)
    
            this.rectangleSelection = undefined;
            this.registry.services.render.scheduleRendering(this.canvas.region, UI_Region.Sidepanel);
        }
    }

    getCursor() {
        if (this.canvas.pointer.hoveredView) {
            return Cursor.Pointer;
        }

        return Cursor.Default;
    }
}