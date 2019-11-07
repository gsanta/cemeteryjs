import { BitmapEditor } from '../BitmapEditor';
import { Tool, ToolType } from './Tool';
import { AbstractSelectionTool } from './AbstractSelectionTool';

export class RectangleTool extends AbstractSelectionTool {
    constructor(bitmapEditor: BitmapEditor) {
        super(bitmapEditor, ToolType.RECTANGLE, false);
    }

    down() {
        super.down();
        this.bitmapEditor.render();
    }

    drag() {
        super.drag();
        
        this.bitmapEditor.pixelController.removePreviews();
        const type = this.bitmapEditor.controllers.worldItemTypeController.getModel().selectedType.typeName;
        if (this.bitmapEditor.mouseController.isDrag) {
            const positions = this.getPositionsInSelection();
            positions.forEach(pos => this.bitmapEditor.pixelController.addPreview(pos, type));
        } else {
            this.bitmapEditor.pixelController.addPreview(this.bitmapEditor.mouseController.movePoint, type);
        }

        this.bitmapEditor.render();
    }

    up() {

        this.bitmapEditor.pixelController.commitPreviews();

        super.up();

        this.bitmapEditor.render();
    }
}