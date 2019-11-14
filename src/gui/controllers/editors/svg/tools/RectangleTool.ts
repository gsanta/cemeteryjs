import { SvgEditorController } from '../SvgEditorController';
import { AbstractSelectionTool } from './AbstractSelectionTool';
import { ToolType } from './Tool';

export class RectangleTool extends AbstractSelectionTool {
    constructor(bitmapEditor: SvgEditorController) {
        super(bitmapEditor, ToolType.RECTANGLE, false);
    }

    down() {
        super.down();
        this.bitmapEditor.updateUI();
    }

    drag() {
        super.drag();
        
        this.bitmapEditor.pixelModel.removePreviews();
        const type = this.bitmapEditor.controllers.worldItemDefinitionController.getModel().selectedType.typeName;
        const positions = this.getPositionsInSelection();
        positions.forEach(pos => this.bitmapEditor.pixelModel.addPixel(pos, type, true));

        this.bitmapEditor.updateUI();
    }

    up() {
        if (this.bitmapEditor.mouseController.isDrag) {
            this.bitmapEditor.pixelModel.commitPreviews();
        } else {
            const type = this.bitmapEditor.controllers.worldItemDefinitionController.getModel().selectedType.typeName;
            this.bitmapEditor.pixelModel.addPixel(this.bitmapEditor.mouseController.movePoint, type, false);
        }

        super.up();

        this.bitmapEditor.setRendererDirty();
        this.bitmapEditor.updateUI();
    }
}