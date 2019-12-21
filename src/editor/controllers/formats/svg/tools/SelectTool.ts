import { SvgCanvasController } from "../SvgCanvasController";
import { AbstractSelectionTool } from "./AbstractSelectionTool";
import { ToolType } from "./Tool";
import { CanvasItemTag } from "../models/CanvasItem";

export class SelectTool extends AbstractSelectionTool {

    constructor(canvasController: SvgCanvasController) {
        super(canvasController, ToolType.SELECT, true);
    }

    down() {
        super.down();
        this.canvasController.renderCanvas();
    }

    drag() {
        super.drag();
        this.canvasController.renderCanvas();
    }

    click() {
        super.click();

        CanvasItemTag.removeTag(CanvasItemTag.SELECTED, this.canvasController.pixelModel.items);

        const items = this.canvasController.pixelModel.getIntersectingItemsAtPoint(this.canvasController.mouseController.movePoint);

        items.forEach(item => item.tags.add(CanvasItemTag.SELECTED));

        this.canvasController.renderCanvas();
        this.canvasController.renderSettings();
    }

    draggedUp() {
        super.draggedUp();
        const canvasItems = this.canvasController.pixelModel.getIntersectingItemsInRect(this.getSelectionRect());

        CanvasItemTag.addTag(CanvasItemTag.SELECTED, canvasItems);

        this.canvasController.renderCanvas();
    }
}