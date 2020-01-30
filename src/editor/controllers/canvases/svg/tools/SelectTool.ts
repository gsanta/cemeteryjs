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

        const canvasStore = this.canvasController.canvasStore;

        canvasStore.removeTag(this.canvasController.canvasStore.items, CanvasItemTag.SELECTED);

        const selectedItems = this.canvasController.canvasStore.getIntersectingItemsAtPoint(this.canvasController.mouseController.pointer.curr);

        const topItem = maxBy(selectedItems, (a, b) => canvasStore.getLayer(a) - canvasStore.getLayer(b));

        topItem && canvasStore.addTag([topItem], CanvasItemTag.SELECTED);

        this.canvasController.renderCanvas();
        this.canvasController.renderToolbar();
    }

    draggedUp() {
        super.draggedUp();
        const canvasItems = this.canvasController.canvasStore.getIntersectingItemsInRect(this.getSelectionRect());
        const canvasStore = this.canvasController.canvasStore;
        
        canvasStore.removeTag(this.canvasController.canvasStore.items, CanvasItemTag.SELECTED);
        canvasStore.addTag(canvasItems, CanvasItemTag.SELECTED);

        this.canvasController.renderCanvas();
    }
}