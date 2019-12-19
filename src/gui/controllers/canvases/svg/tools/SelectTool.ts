import { PixelTag } from "../models/GridCanvasStore";
import { SvgCanvasController } from "../SvgCanvasController";
import { AbstractSelectionTool } from "./AbstractSelectionTool";
import { ToolType } from "./Tool";
import { Rectangle } from "../../../../../geometry/shapes/Rectangle";


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
        const selectionRect = this.canvasController.selectionModel.getSelectionRect();
        const rectangle = new Rectangle(selectionRect.topLeft, selectionRect.bottomRight);
        const canvasItems = this.canvasController.pixelModel.getIntersectingItemsInRect(rectangle);

        PixelTag.addTag(PixelTag.SELECTED, canvasItems);

        this.canvasController.renderCanvas();
    }
}