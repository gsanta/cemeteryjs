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
        
        this.bitmapEditor.model.pixels.removePreviews();
        const type = this.bitmapEditor.controllers.worldItemDefinitionController.getModel().selectedType.typeName;
        const positions = this.getPositionsInSelection();
        positions.forEach(pos => this.bitmapEditor.model.pixels.addPixel(pos, type, true));

        this.bitmapEditor.updateUI();
    }

    up() {
        if (this.bitmapEditor.mouseController.isDrag) {
            this.bitmapEditor.model.pixels.commitPreviews();
        } else {
            const type = this.bitmapEditor.controllers.worldItemDefinitionController.getModel().selectedType.typeName;
            this.bitmapEditor.model.pixels.addPixel(this.bitmapEditor.mouseController.movePoint, type, false);
        }

        super.up();

        this.bitmapEditor.setRendererDirty();
        this.bitmapEditor.updateUI();
    }
}