import { CanvasController } from "../CanvasController";
import { AbstractSelectionTool } from "./AbstractSelectionTool";
import { ToolType } from "./Tool";
import { CanvasItemTag } from "../models/CanvasItem";

export class SelectTool extends AbstractSelectionTool {

    constructor(controller: CanvasController) {
        super(controller, ToolType.SELECT, true, [controller. controller.pointerTool]);
    }

    down() {
        return super.down();
    }

    drag() {
        super.drag();
        this.controller.renderWindow();
    }

    draggedUp() {
        super.draggedUp();
        const canvasItems = this.controller.viewStore.getIntersectingItemsInRect(this.getSelectionRect());
        const canvasStore = this.controller.viewStore;
        
        canvasStore.removeTag(this.controller.viewStore.getViews(), CanvasItemTag.SELECTED);
        canvasStore.addTag(canvasItems, CanvasItemTag.SELECTED);

        this.controller.renderWindow();
        this.controller.renderToolbar();
    }

    getSubtools() {
        return [this.controller.pointerTool, this.controller.]
    }
}