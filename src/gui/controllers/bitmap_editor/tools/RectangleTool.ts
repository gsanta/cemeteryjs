import { BitmapEditor } from '../BitmapEditor';
import { Tool, ToolType } from './Tool';

export class RectangleTool implements Tool {
    type = ToolType.RECTANGLE;
    private bitmapEditor: BitmapEditor;

    constructor(bitmapEditor: BitmapEditor) {
        this.bitmapEditor = bitmapEditor;
    }

    up() {
        const type = this.bitmapEditor.controllers.definitionController.selectedMeshDescriptor.type;
        this.bitmapEditor.pixelController.addPixel(this.bitmapEditor.mouseController.pointer, {type});
        this.bitmapEditor.render();
    }
}