import { CanvasView } from '../CanvasView';
import { RectangleSelector } from "./selection/RectangleSelector";
import { ToolType, Tool } from "./Tool";
import { AbstractTool } from "./AbstractTool";
import { UpdateTask } from "../../../services/UpdateServices";
import { Stores } from '../../../stores/Stores';
import { ServiceLocator } from '../../../services/ServiceLocator';
import { Concept } from '../models/concepts/Concept';
import { Feedback } from '../models/feedbacks/Feedback';

export class SelectTool extends AbstractTool {
    protected view: CanvasView;
    private rectSelector: RectangleSelector;

    private activeTool: Tool;
    private getStores: () => Stores;
    private getServices: () => ServiceLocator;

    constructor(view: CanvasView, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(ToolType.SELECT);
        this.view = view;
        this.getStores = getStores;
        this.getServices = getServices;
        this.rectSelector = new RectangleSelector(view);
    }

    down() {
        const hovered = this.getStores().hoverStore.getAny();

        if (hovered && this.getStores().selectionStore.contains(hovered)) {
            this.activeTool = this.view.getToolByType(ToolType.MOVE);
            this.activeTool.down();
        }
    }

    click() {
        if (this.getStores().hoverStore.hasAny()) {
            this.view.getToolByType(ToolType.POINTER).click();
        } else if (this.getStores().selectionStore.getAll().length > 0) {
            this.getStores().selectionStore.clear();
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
        }
    }

    drag() {
        if (this.activeTool) {
            this.activeTool.drag();
        } else {
            this.rectSelector.updateRect(this.getServices().pointerService().pointer);
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
        }
    }

    draggedUp() {
        if (this.activeTool) {
            this.activeTool.draggedUp();
            this.activeTool = undefined;
            return;
        }

        const feedback = this.view.feedbackStore.rectSelectFeedback;
        if (!feedback) { return }

        const canvasItems = this.getStores().canvasStore.getIntersectingItemsInRect(feedback.rect);
        this.view.getToolByType(ToolType.POINTER)
        
        this.getStores().selectionStore.clear();
        this.getStores().selectionStore.addItem(...canvasItems)

        this.rectSelector.finish();
        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    over(item: Concept | Feedback) {
        this.view.getToolByType(ToolType.POINTER).over(item);
    }

    out(item: Concept | Feedback) {
        this.view.getToolByType(ToolType.POINTER).out(item);
    }
}