import { BitmapEditorController } from '../BitmapEditorController';
import { AbstractSelectionTool } from './AbstractSelectionTool';
import { ToolType } from './Tool';

export class DeleteTool extends AbstractSelectionTool {
    constructor(bitmapEditor: BitmapEditorController) {
        super(bitmapEditor, ToolType.DELETE, true);
    }

    down() {
        super.down();
        this.bitmapEditor.updateUI();
    }

    drag() {
        super.drag();
        this.bitmapEditor.updateUI();
    }

    up() {
        if (this.bitmapEditor.mouseController.isDrag) {
            const pixels = this.getPixelsInSelection();

            pixels.forEach(pixel => this.bitmapEditor.model.pixels.removePixelAtIndex(pixel.index));
        } else {
            const pixel = this.bitmapEditor.model.pixels.getPixelAtCoordinate(this.bitmapEditor.mouseController.movePoint);
            pixel && this.bitmapEditor.model.pixels.removePixelAtIndex(pixel.index);
        }

        super.up();

        this.bitmapEditor.updateUI();
    }
}