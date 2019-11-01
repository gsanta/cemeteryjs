import { BitmapEditor } from '../BitmapEditor';
import { Tool, ToolType } from './Tool';

export class RectangleTool implements Tool {
    type = ToolType.RECTANGLE;
    private bitmapEditor: BitmapEditor;

    constructor(bitmapEditor: BitmapEditor) {
        this.bitmapEditor = bitmapEditor;
    }

    up() {
        this.bitmapEditor.pixelController.addPixel(this.bitmapEditor.mouseController.pointer, {color: 'red'});
        this.bitmapEditor.render();
    }
}