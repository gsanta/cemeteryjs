import { SvgCanvasController } from "../SvgCanvasController";
import { AbstractSelectionTool } from "./AbstractSelectionTool";
import { ToolType } from "./Tool";
import { PixelTag } from "../models/GridCanvasStore";


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

        PixelTag.removeTag(PixelTag.SELECTED, this.canvasController.pixelModel.items);

        const items = this.canvasController.pixelModel.getIntersectingItemsAtPoint(this.canvasController.mouseController.movePoint);

        items.forEach(item => item.tags.add(PixelTag.SELECTED));

        this.canvasController.renderCanvas();
        this.canvasController.renderSettings();
    }

    draggedUp() {
        super.draggedUp();
        const canvasItems = this.canvasController.pixelModel.getIntersectingItemsInRect(this.getSelectionRect());

        PixelTag.addTag(PixelTag.SELECTED, canvasItems);

        this.canvasController.renderCanvas();
    }
}