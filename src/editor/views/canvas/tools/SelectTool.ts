import { CanvasView } from "../CanvasView";
import { RectangleSelector } from "./selection/RectangleSelector";
import { ToolType, Tool } from "./Tool";
import { AbstractTool } from "./AbstractTool";
import { UpdateTask } from "../../../services/UpdateServices";
import { CanvasItemTag } from "../models/CanvasItem";
import { Concept } from "../models/concepts/Concept";
import { Stores } from '../../../stores/Stores';
import { ServiceLocator } from '../../../services/ServiceLocator';

export class SelectTool extends AbstractTool {
    protected controller: CanvasView;
    private rectSelector: RectangleSelector;

    private activeTool: Tool;
    private getStores: () => Stores;
    private getServices: () => ServiceLocator;

    constructor(controller: CanvasView, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(ToolType.SELECT);
        this.controller = controller;
        this.getStores = getStores;
        this.getServices = getServices;
        this.rectSelector = new RectangleSelector(controller);
    }

    down() {
        const hovered = this.getStores().conceptStore.getHoveredView();
        const selected = this.getStores().conceptStore.getSelectedViews();

        if (hovered && selected.includes(hovered)) {
            this.activeTool = this.controller.toolService.moveTool;
        }
    }

    click() {
        if (this.getStores().conceptStore.getHoveredView()) {
            this.controller.toolService.pointerTool.click();
        } else if (this.getStores().conceptStore.getSelectedViews().length > 0) {
            this.getStores().conceptStore.removeTag(this.getStores().conceptStore.getViews(), CanvasItemTag.SELECTED);
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
        }
    }

    drag() {
        if (this.activeTool) {
            this.activeTool.drag();
        } else {
            this.rectSelector.updateRect(this.controller.pointer.pointer);
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
        }
    }

    draggedUp() {
        if (this.activeTool) {
            this.activeTool.draggedUp();
            this.activeTool = undefined;
            return;
        }

        const feedback = this.controller.feedbackStore.rectSelectFeedback;
        if (!feedback) { return }

        const canvasItems = this.getStores().conceptStore.getIntersectingItemsInRect(feedback.rect);
        const canvasStore = this.getStores().conceptStore;
        
        canvasStore.removeTag(this.getStores().conceptStore.getViews(), CanvasItemTag.SELECTED);
        canvasStore.addTag(canvasItems, CanvasItemTag.SELECTED);

        this.rectSelector.finish();
        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    over(item: Concept) {
        this.controller.toolService.pointerTool.over(item);
    }

    out(item: Concept) {
        this.controller.toolService.pointerTool.out(item);
    }
}