import { SvgCanvasController } from '../SvgCanvasController';
import { AbstractSelectionTool } from './AbstractSelectionTool';
import { ToolType } from './Tool';

export class DeleteTool extends AbstractSelectionTool {
    constructor(bitmapEditor: SvgCanvasController) {
        super(bitmapEditor, ToolType.DELETE, true);
    }

    down() {
        super.down();
        this.svgCanvasController.renderCanvas();
    }

    drag() {
        super.drag();
        this.svgCanvasController.renderCanvas();
    }

    click() {
        super.click();
        const pixel = this.svgCanvasController.pixelModel.getTopPixelAtCoordinate(this.svgCanvasController.mouseController.movePoint);
        pixel && this.svgCanvasController.pixelModel.removePixelFromMapAtLayer(pixel.index, pixel.layer);
        this.svgCanvasController.renderCanvas();
    }
    
    draggedUp() {
        super.draggedUp();
        const pixelIndexes = this.getPixelIndexesInSelection();
        pixelIndexes.forEach(pixelIndex => this.svgCanvasController.pixelModel.removeTopPixel(pixelIndex));
        this.svgCanvasController.renderCanvas();
    }
}
