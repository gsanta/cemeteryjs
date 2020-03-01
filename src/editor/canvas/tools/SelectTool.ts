import { CanvasController } from "../CanvasController";
import { CanvasItemTag } from "../models/CanvasItem";
import { RectangleSelector } from "./selection/RectangleSelector";
import { ToolType, Tool } from "./Tool";
import { AbstractTool } from "./AbstractTool";
import { View } from "../models/views/View";
import { UpdateTask } from "../services/CanvasUpdateServices";

export class SelectTool extends AbstractTool {
    protected controller: CanvasController;
    private rectSelector: RectangleSelector;

    private activeTool: Tool;

    constructor(controller: CanvasController) {
        super(ToolType.SELECT);
        this.controller = controller;
        this.rectSelector = new RectangleSelector(controller);
    }

    down() {
        const hovered = this.controller.viewStore.getHoveredView();
        const selected = this.controller.viewStore.getSelectedViews();

        if (hovered && selected.includes(hovered)) {
            this.activeTool = this.controller.toolService.moveTool;
        }
    }

    click() {
        if (this.controller.viewStore.getHoveredView()) {
            this.controller.toolService.pointerTool.click();
        } else if (this.controller.viewStore.getSelectedViews().length > 0) {
            this.controller.viewStore.removeTag(this.controller.viewStore.getViews(), CanvasItemTag.SELECTED);
            this.controller.updateService.addUpdateTasks(UpdateTask.RepaintCanvas);
        }
    }

    drag() {
        if (this.activeTool) {
            this.activeTool.drag();
        } else {
            this.rectSelector.updateRect(this.controller.pointer.pointer);
            this.controller.updateService.addUpdateTasks(UpdateTask.RepaintCanvas);
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

        const canvasItems = this.controller.viewStore.getIntersectingItemsInRect(feedback.rect);
        const canvasStore = this.controller.viewStore;
        
        canvasStore.removeTag(this.controller.viewStore.getViews(), CanvasItemTag.SELECTED);
        canvasStore.addTag(canvasItems, CanvasItemTag.SELECTED);

        this.rectSelector.finish();
        this.controller.updateService.addUpdateTasks(UpdateTask.RepaintCanvas);
    }

    over(item: View) {
        this.controller.toolService.pointerTool.over(item);
    }

    out(item: View) {
        this.controller.toolService.pointerTool.out(item);
    }
}