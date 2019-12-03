import { SvgCanvasController } from '../SvgCanvasController';
import { AbstractSelectionTool } from './AbstractSelectionTool';
import { ToolType } from './Tool';
import { Rectangle } from '@nightshifts.inc/geometry';

export class DeleteTool extends AbstractSelectionTool {
    constructor(bitmapEditor: SvgCanvasController) {
        super(bitmapEditor, ToolType.DELETE, true);
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
        const pixel = this.canvasController.pixelModel.getTopPixelAtCoordinate(this.canvasController.mouseController.movePoint);
        pixel && this.canvasController.pixelModel.removePixelFromMapAtLayer(pixel.index, pixel.layer);
        this.canvasController.renderCanvas();
    }
    
    draggedUp() {
        super.draggedUp();
        const selectionRect = this.canvasController.selectionModel.getSelectionRect();
        const rectangle = new Rectangle(selectionRect.topLeft, selectionRect.bottomRight);
        const canvasItems = this.canvasController.pixelModel.getIntersectingItemsInRect(rectangle);

        canvasItems.forEach(item => this.canvasController.pixelModel.removeRectangle(item));

        this.canvasController.renderCanvas();
    }
}
