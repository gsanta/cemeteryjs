import { SvgCanvasController } from '../SvgCanvasController';
import { AbstractSelectionTool } from './AbstractSelectionTool';
import { ToolType } from './Tool';

export class DeleteTool extends AbstractSelectionTool {
    constructor(bitmapEditor: SvgCanvasController) {
        super(bitmapEditor, ToolType.DELETE, true);
    }

    down() {
        super.down();
        this.svgCanvasController.render();
    }

    drag() {
        super.drag();
        this.svgCanvasController.render();
    }

    up() {
        if (this.svgCanvasController.mouseController.isDrag) {
            const pixelIndexes = this.getPixelIndexesInSelection();
            pixelIndexes.forEach(pixelIndex => this.svgCanvasController.pixelModel.removeTopPixel(pixelIndex));
        } else {
            const pixel = this.svgCanvasController.pixelModel.getTopPixelAtCoordinate(this.svgCanvasController.mouseController.movePoint);
            pixel && this.svgCanvasController.pixelModel.removePixelFromMapAtLayer(pixel.index, pixel.layer);
        }

        super.up();

        this.svgCanvasController.render();
    }
}
