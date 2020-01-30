import { SvgCanvasController } from "../SvgCanvasController";
import { AbstractSelectionTool } from "./AbstractSelectionTool";
import { ToolType } from "./Tool";
import { CanvasItemTag } from "../models/CanvasItem";
import { maxBy } from '../../../../../model/geometry/utils/Functions';

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

        CanvasItemTag.removeTag(CanvasItemTag.SELECTED, this.canvasController.canvasStore.items);

        const selectedItems = this.canvasController.canvasStore.getIntersectingItemsAtPoint(this.canvasController.mouseController.pointer.curr);

        const topItem = maxBy(selectedItems, (a, b) => a.layer - b.layer);

        topItem && topItem.tags.add(CanvasItemTag.SELECTED);

        this.canvasController.renderCanvas();
    }

    draggedUp() {
        super.draggedUp();
        const canvasItems = this.canvasController.canvasStore.getIntersectingItemsInRect(this.getSelectionRect());
        CanvasItemTag.removeTag(CanvasItemTag.SELECTED, this.canvasController.canvasStore.items);
        CanvasItemTag.addTag(CanvasItemTag.SELECTED, canvasItems);

        this.canvasController.renderCanvas();
    }
}