import { PointerTracker } from '../../controller/PointerHandler';
import { AbstractShape } from '../../models/shapes/AbstractShape';
import { Registry } from '../../Registry';
import { getIntersectingViews } from '../../stores/ShapeStore';
import { AbstractCanvasPanel } from '../AbstractCanvasPanel';
import { UI_Region } from '../UI_Panel';
import { PointerTool, PointerToolLogic } from './PointerTool';
import { Cursor } from "./Tool";
import { createRectFromMousePointer } from './ToolAdapter';

export const SelectToolId = 'select-tool';
export class SelectTool extends PointerTool<AbstractShape> {

    constructor(logic: PointerToolLogic<AbstractShape>, canvas: AbstractCanvasPanel<AbstractShape>, registry: Registry) {
        super(SelectToolId, logic, canvas, registry);
    }

    down() {
        if (this.canvas.pointer.hoveredView && this.canvas.pointer.hoveredView.isSelected()) {
            super.down();
        }
    }

    click(pointer: PointerTracker<AbstractShape>) {
        if (this.canvas.pointer.hoveredView) {
            super.click(pointer);
        } else if (this.canvas.store.getSelectedItems().length > 0) {
            this.canvas.store.clearSelection();
            this.registry.services.render.scheduleRendering(this.canvas.region, UI_Region.Sidepanel);
        }
    }

    drag(pointer: PointerTracker<AbstractShape>) {
        if (this.draggedItem) {
            super.drag(pointer);
        } else {
            this.rectangleSelection = createRectFromMousePointer(pointer);
            this.registry.services.render.scheduleRendering(this.canvas.region);
        }
    }

    draggedUp(pointer: PointerTracker<AbstractShape>) {
        if (this.draggedItem) {
            super.draggedUp(pointer);
        } else {
            if (!this.rectangleSelection) { return }
    
            const intersectingViews = getIntersectingViews(this.canvas.store, this.rectangleSelection);
            
            this.canvas.store.clearSelection();
            this.canvas.store.addSelectedItem(...intersectingViews)
    
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