import { Registry } from '../../../core/Registry';
import { RenderTask } from "../../../core/services/RenderServices";
import { PointerTool } from './PointerTool';
import { RectangleSelector } from "./RectangleSelector";
import { ToolType, Cursor } from "./Tool";
import { IPointerEvent } from '../../../core/services/input/PointerService';

export class SelectTool extends PointerTool {
    private rectSelector: RectangleSelector;

    constructor(registry: Registry) {
        super(ToolType.Select, registry);
        this.rectSelector = new RectangleSelector(registry);
    }

    down() {
        if (this.registry.stores.selectionStore.contains(this.registry.services.pointer.hoveredItem)) {
            super.down();
        }
    }

    click() {
        if (this.registry.services.pointer.hoveredItem) {
            super.click();
        } else if (this.registry.stores.selectionStore.getAll().length > 0) {
            this.registry.stores.selectionStore.clear();
            this.registry.services.update.scheduleTasks(RenderTask.RenderFocusedView, RenderTask.RenderSidebar);
        }
    }

    drag(e: IPointerEvent) {
        if (this.movingItem) {
            super.drag(e);
        } else {
            this.rectSelector.updateRect(this.registry.services.pointer.pointer);
            this.registry.services.update.scheduleTasks(RenderTask.RenderFocusedView);
        }
    }

    draggedUp() {
        if (this.movingItem) {
            super.draggedUp();
        } else {
            const feedback = this.registry.stores.feedback.rectSelectFeedback;
            if (!feedback) { return }
    
            const canvasItems = this.registry.stores.canvasStore.getIntersectingItemsInRect(feedback.rect);
            
            this.registry.stores.selectionStore.clear();
            this.registry.stores.selectionStore.addItem(...canvasItems)
    
            this.rectSelector.finish();
            this.registry.services.update.scheduleTasks(RenderTask.RenderFocusedView, RenderTask.RenderSidebar);
        }
    }

    getCursor() {
        if (this.registry.services.pointer.hoveredItem) {
            return Cursor.Pointer;
        }

        return Cursor.Default;
    }
}