import { BitmapEditor } from './BitmapEditor';


export class RectangleTool {
    private bitmapEditor: BitmapEditor;

    constructor(bitmapEditor: BitmapEditor) {
        this.bitmapEditor = bitmapEditor;
    }

    up() {
        this.bitmapEditor.pixelController.addPixel(this.bitmapEditor.mouseController.pointer, {color: 'red'});
        this.bitmapEditor.render();
    }
}