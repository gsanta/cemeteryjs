import { ServiceLocator } from '../../../services/ServiceLocator';
import { UpdateTask } from "../../../services/UpdateServices";
import { Stores } from '../../../stores/Stores';
import { CanvasView } from '../CanvasView';
import { Concept } from '../models/concepts/Concept';
import { Feedback } from '../models/feedbacks/Feedback';
import { PointerTool } from './PointerTool';
import { RectangleSelector } from "./selection/RectangleSelector";
import { ToolType } from "./Tool";

export class SelectTool extends PointerTool {
    protected view: CanvasView;
    private rectSelector: RectangleSelector;

    constructor(view: CanvasView, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(getServices, getStores, ToolType.SELECT);
        this.view = view;
        this.getStores = getStores;
        this.getServices = getServices;
        this.rectSelector = new RectangleSelector(view);
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
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas, UpdateTask.RepaintSettings);
        }
    }

    drag() {
        if (this.movingItem) {
            super.drag();
        } else {
            this.rectSelector.updateRect(this.getServices().pointerService().pointer);
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
        }
    }

    draggedUp() {
        if (this.movingItem) {
            super.draggedUp();
        } else {
            const feedback = this.view.feedbackStore.rectSelectFeedback;
            if (!feedback) { return }
    
            const canvasItems = this.getStores().canvasStore.getIntersectingItemsInRect(feedback.rect);
            this.view.getToolByType(ToolType.POINTER)
            
            this.getStores().selectionStore.clear();
            this.getStores().selectionStore.addItem(...canvasItems)
    
            this.rectSelector.finish();
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas, UpdateTask.RepaintSettings);
        }

    }

    over(item: Concept | Feedback) {
        this.view.getToolByType(ToolType.POINTER).over(item);
    }

    out(item: Concept | Feedback) {
        this.view.getToolByType(ToolType.POINTER).out(item);
    }
}