import { SvgCanvasController } from '../SvgCanvasController';
import { AbstractSelectionTool } from './AbstractSelectionTool';
import { ToolType } from './Tool';

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
        const pixelIndexes = this.getPixelIndexesInSelection();
        pixelIndexes.forEach(pixelIndex => this.canvasController.pixelModel.removeTopPixel(pixelIndex));
        this.canvasController.renderCanvas();
    }
}
