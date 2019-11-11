import { BitmapEditorController } from '../BitmapEditorController';
import { Tool, ToolType } from './Tool';
import { AbstractSelectionTool } from './AbstractSelectionTool';

export class RectangleTool extends AbstractSelectionTool {
    constructor(bitmapEditor: BitmapEditorController) {
        super(bitmapEditor, ToolType.RECTANGLE, false);
    }

    down() {
        super.down();
        this.bitmapEditor.updateUI();
    }

    drag() {
        super.drag();
        
        this.bitmapEditor.pixelController.removePreviews();
        const type = this.bitmapEditor.controllers.worldItemDefinitionController.getModel().selectedType.typeName;
        const positions = this.getPositionsInSelection();
        positions.forEach(pos => this.bitmapEditor.pixelController.addPixel(pos, type, true));

        this.bitmapEditor.updateUI();
    }

    up() {
        if (this.bitmapEditor.mouseController.isDrag) {
            this.bitmapEditor.pixelController.commitPreviews();
        } else {
            const type = this.bitmapEditor.controllers.worldItemDefinitionController.getModel().selectedType.typeName;
            this.bitmapEditor.pixelController.addPixel(this.bitmapEditor.mouseController.movePoint, type, false);
        }

        super.up();

        this.bitmapEditor.updateRenderer();
        this.bitmapEditor.updateUI();
    }
}