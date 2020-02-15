import { CanvasController } from "../CanvasController";
import { AbstractSelectionTool } from "./AbstractSelectionTool";
import { ToolType } from "./Tool";
import { CanvasItemTag } from "../models/CanvasItem";

export class SelectTool extends AbstractSelectionTool {

    constructor(controller: CanvasController) {
        super(controller, ToolType.SELECT, true);
    }

    down() {
        super.down();
        this.services.renderWindow();
    }

    drag() {
        super.drag();
        this.services.renderWindow();
    }

    click() {
        super.click();

        const viewStore = this.services.viewStore;

        viewStore.removeTag(viewStore.getViews(), CanvasItemTag.SELECTED);

        const hoveredView = viewStore.getHoveredView()

        hoveredView && viewStore.addTag([hoveredView], CanvasItemTag.SELECTED);

        this.services.renderWindow();
        this.services.renderToolbar();
    }

    draggedUp() {
        super.draggedUp();
        const canvasItems = this.services.viewStore.getIntersectingItemsInRect(this.getSelectionRect());
        const canvasStore = this.services.viewStore;
        
        canvasStore.removeTag(this.services.viewStore.getViews(), CanvasItemTag.SELECTED);
        canvasStore.addTag(canvasItems, CanvasItemTag.SELECTED);

        this.services.renderWindow();
        this.services.renderToolbar();
    }
}