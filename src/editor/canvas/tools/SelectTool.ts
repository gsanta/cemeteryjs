import { CanvasController } from "../CanvasController";
import { CanvasItemTag } from "../models/CanvasItem";
import { MultiTool } from "./MultiTool";
import { RectangleSelector } from "./selection/RectangleSelector";
import { ToolType } from "./Tool";

export class SelectTool extends MultiTool {
    protected controller: CanvasController;
    private rectSelector: RectangleSelector;

    constructor(controller: CanvasController) {
        super(ToolType.SELECT);
        this.controller = controller;
        this.rectSelector = new RectangleSelector(controller);
    }

    doClick() {
        if (this.controller.viewStore.getSelectedViews().length > 0) {
            this.controller.viewStore.removeTag(this.controller.viewStore.getViews(), CanvasItemTag.SELECTED);
            return true;
        }

        return false;
    }

    doDrag() {
        this.rectSelector.updateRect(this.controller.pointer.pointer);
        return true; 
    }

    doDraggedUp() {
        const feedback = this.controller.feedbackStore.rectSelectFeedback;
        if (!feedback) { return }

        const canvasItems = this.controller.viewStore.getIntersectingItemsInRect(feedback.rect);
        const canvasStore = this.controller.viewStore;
        
        canvasStore.removeTag(this.controller.viewStore.getViews(), CanvasItemTag.SELECTED);
        canvasStore.addTag(canvasItems, CanvasItemTag.SELECTED);

        this.rectSelector.finish();

        this.controller.renderWindow();
        this.controller.renderToolbar();

        return true;
    }

    getSubtools() {
        return [this.controller.moveTool, this.controller.pointerTool];
    }
}