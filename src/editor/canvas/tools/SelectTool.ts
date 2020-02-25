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

    doDrag() {
        this.rectSelector.updateRect(this.controller.pointer.pointer);
        return true; 
    }

    doDraggedUp() {
        const canvasItems = this.controller.viewStore.getIntersectingItemsInRect(this.controller.feedbackStore.rectSelectFeedback.rect);
        const canvasStore = this.controller.viewStore;
        
        canvasStore.removeTag(this.controller.viewStore.getViews(), CanvasItemTag.SELECTED);
        canvasStore.addTag(canvasItems, CanvasItemTag.SELECTED);

        this.rectSelector.finish();

        this.controller.renderWindow();
        this.controller.renderToolbar();

        return true;
    }

    getSubtools() {
        return [this.controller.pointerTool, this.controller.moveTool];
    }
}