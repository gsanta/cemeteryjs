import { CanvasController } from "../CanvasController";
import { CanvasItemTag } from "../models/CanvasItem";
import { RectangleSelector } from "./selection/RectangleSelector";
import { ToolType } from "./Tool";
import { AbstractTool } from "./AbstractTool";
import { View } from "../models/views/View";

export class SelectTool extends AbstractTool {
    protected controller: CanvasController;
    private rectSelector: RectangleSelector;

    constructor(controller: CanvasController) {
        super(ToolType.SELECT);
        this.controller = controller;
        this.rectSelector = new RectangleSelector(controller);
    }

    click() {
        if (this.controller.viewStore.getHoveredView()) {
            this.controller.pointerTool.click();
        } else if (this.controller.viewStore.getSelectedViews().length > 0) {
            this.controller.viewStore.removeTag(this.controller.viewStore.getViews(), CanvasItemTag.SELECTED);
            this.controller.renderWindow();
        }
    }

    drag() {
        this.rectSelector.updateRect(this.controller.pointer.pointer);
        this.controller.renderWindow();
    }

    draggedUp() {
        const feedback = this.controller.feedbackStore.rectSelectFeedback;
        if (!feedback) { return }

        const canvasItems = this.controller.viewStore.getIntersectingItemsInRect(feedback.rect);
        const canvasStore = this.controller.viewStore;
        
        canvasStore.removeTag(this.controller.viewStore.getViews(), CanvasItemTag.SELECTED);
        canvasStore.addTag(canvasItems, CanvasItemTag.SELECTED);

        this.rectSelector.finish();
        this.controller.renderWindow();
    }

    over(item: View) {
        this.controller.pointerTool.over(item);
    }

    out(item: View) {
        this.controller.pointerTool.out(item);
    }
}