import { Registry } from '../../Registry';
import { UpdateTask } from "../UpdateServices";
import { PointerTool } from './PointerTool';
import { RectangleSelector } from "./RectangleSelector";
import { ToolType } from "./Tool";

export class SelectTool extends PointerTool {
    private rectSelector: RectangleSelector;

    constructor(registry: Registry) {
        super(ToolType.SELECT, registry);
        this.rectSelector = new RectangleSelector(registry);
    }

    down() {
        if (this.registry.stores.selectionStore.contains(this.registry.stores.hoverStore.getAny())) {
            super.down();
        }
    }

    click() {
        if (this.registry.stores.hoverStore.hasAny()) {
            super.click();
        } else if (this.registry.stores.selectionStore.getAll().length > 0) {
            this.registry.stores.selectionStore.clear();
            this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas, UpdateTask.RepaintSettings);
        }
    }

    drag() {
        if (this.movingItem) {
            super.drag();
        } else {
            this.rectSelector.updateRect(this.registry.services.pointer.pointer);
            this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
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
            this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas, UpdateTask.RepaintSettings);
        }

    }
}