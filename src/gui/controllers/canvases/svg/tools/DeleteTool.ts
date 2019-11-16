import { SvgCanvasController } from '../SvgCanvasController';
import { AbstractSelectionTool } from './AbstractSelectionTool';
import { ToolType } from './Tool';

export class DeleteTool extends AbstractSelectionTool {
    constructor(bitmapEditor: SvgCanvasController) {
        super(bitmapEditor, ToolType.DELETE, true);
    }

    down() {
        super.down();
        this.svgCanvasController.updateUI();
    }

    drag() {
        super.drag();
        this.svgCanvasController.updateUI();
    }

    up() {
        if (this.svgCanvasController.mouseController.isDrag) {
            const pixels = this.getPixelsInSelection();

            pixels.forEach(pixel => this.svgCanvasController.pixelModel.removePixelAtIndex(pixel.index));
        } else {
            const pixel = this.svgCanvasController.pixelModel.getPixelAtCoordinate(this.svgCanvasController.mouseController.movePoint);
            pixel && this.svgCanvasController.pixelModel.removePixelAtIndex(pixel.index);
        }

        super.up();

        this.svgCanvasController.updateUI();
    }
}