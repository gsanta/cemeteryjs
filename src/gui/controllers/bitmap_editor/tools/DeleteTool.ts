import { BitmapEditor } from '../BitmapEditor';
import { AbstractSelectionTool } from './AbstractSelectionTool';
import { ToolType } from './Tool';

export class DeleteTool extends AbstractSelectionTool {
    constructor(bitmapEditor: BitmapEditor) {
        super(bitmapEditor, ToolType.DELETE, true);
    }

    down() {
        super.down();
        this.bitmapEditor.render();
    }

    drag() {
        super.drag();
        this.bitmapEditor.render();
    }

    up() {
        if (this.bitmapEditor.mouseController.isDrag) {
            const pixels = this.getPixelsInSelection();

            pixels.forEach(pixel => this.bitmapEditor.pixelController.removePixel(pixel.index));
        } else {
            this.bitmapEditor.pixelController.removePixelAtPosition(this.bitmapEditor.mouseController.movePoint);
        }

        super.up();

        this.bitmapEditor.render();
    }
}