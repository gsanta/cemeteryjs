import { BitmapEditor } from '../BitmapEditor';
import { Tool, ToolType } from './Tool';
import { AbstractSelectionTool } from './AbstractSelectionTool';

export class RectangleTool extends AbstractSelectionTool {
    constructor(bitmapEditor: BitmapEditor) {
        super(bitmapEditor, ToolType.RECTANGLE);
    }

    up() {
        const type = this.bitmapEditor.controllers.worldItemTypeController.getModel().selectedType.typeName;

        if (this.bitmapEditor.mouseController.isDrag) {
            const positions = this.getPositionsInSelection();
            positions.forEach(pos => this.bitmapEditor.pixelController.addPixel(pos, type));
        } else {
            this.bitmapEditor.pixelController.addPixel(this.bitmapEditor.mouseController.movePoint, type);
        }
        super.up();

        this.bitmapEditor.render();
    }
}