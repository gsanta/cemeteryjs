import { ServiceLocator } from '../ServiceLocator';
import { UpdateTask } from "../UpdateServices";
import { Stores } from '../../stores/Stores';
import { CanvasView } from '../../views/canvas/CanvasView';
import { Concept } from '../../views/canvas/models/concepts/Concept';
import { Feedback } from '../../views/canvas/models/feedbacks/Feedback';
import { PointerTool } from './PointerTool';
import { RectangleSelector } from "./RectangleSelector";
import { ToolType } from "./Tool";

export class SelectTool extends PointerTool {
    private rectSelector: RectangleSelector;

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        super(getServices, getStores, ToolType.SELECT);
        this.getStores = getStores;
        this.getServices = getServices;
        this.rectSelector = new RectangleSelector(getStores);
    }

    down() {
        if (this.getStores().selectionStore.contains(this.getStores().hoverStore.getAny())) {
            super.down();
        }
    }

    click() {
        if (this.getStores().hoverStore.hasAny()) {
            super.click();
        } else if (this.getStores().selectionStore.getAll().length > 0) {
            this.getStores().selectionStore.clear();
            this.getServices().update.scheduleTasks(UpdateTask.RepaintCanvas, UpdateTask.RepaintSettings);
        }
    }

    drag() {
        if (this.movingItem) {
            super.drag();
        } else {
            this.rectSelector.updateRect(this.getServices().pointer.pointer);
            this.getServices().update.scheduleTasks(UpdateTask.RepaintCanvas);
        }
    }

    draggedUp() {
        if (this.movingItem) {
            super.draggedUp();
        } else {
            const feedback = this.getStores().feedback.rectSelectFeedback;
            if (!feedback) { return }
    
            const canvasItems = this.getStores().canvasStore.getIntersectingItemsInRect(feedback.rect);
            
            this.getStores().selectionStore.clear();
            this.getStores().selectionStore.addItem(...canvasItems)
    
            this.rectSelector.finish();
            this.getServices().update.scheduleTasks(UpdateTask.RepaintCanvas, UpdateTask.RepaintSettings);
        }

    }
}