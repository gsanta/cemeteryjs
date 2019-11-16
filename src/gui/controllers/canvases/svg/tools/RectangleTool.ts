import { SvgCanvasController } from '../SvgCanvasController';
import { AbstractSelectionTool } from './AbstractSelectionTool';
import { ToolType } from './Tool';

export class RectangleTool extends AbstractSelectionTool {
    constructor(bitmapEditor: SvgCanvasController) {
        super(bitmapEditor, ToolType.RECTANGLE, false);
    }

    down() {
        super.down();
        this.svgCanvasController.render();
    }

    drag() {
        super.drag();
        
        this.svgCanvasController.pixelModel.removePreviews();
        const type = this.svgCanvasController.WorldItemDefinitionForm.getModel().selectedType.typeName;
        const positions = this.getPositionsInSelection();
        positions.forEach(pos => this.svgCanvasController.pixelModel.addPixel(pos, type, true));

        this.svgCanvasController.render();
    }

    up() {
        if (this.svgCanvasController.mouseController.isDrag) {
            this.svgCanvasController.pixelModel.commitPreviews();
        } else {
            const type = this.svgCanvasController.WorldItemDefinitionForm.getModel().selectedType.typeName;
            this.svgCanvasController.pixelModel.addPixel(this.svgCanvasController.mouseController.movePoint, type, false);
        }

        super.up();

        this.svgCanvasController.render();
    }
}