import { SvgCanvasController } from '../SvgCanvasController';
import { AbstractSelectionTool } from './AbstractSelectionTool';
import { ToolType } from './Tool';
import { EventDispatcher } from '../../../events/EventDispatcher';
import { Events } from '../../../events/Events';
import { getLayerForType } from '../models/PixelModel';

export class RectangleTool extends AbstractSelectionTool {
    private eventDispatcher: EventDispatcher;

    constructor(svgCanvasController: SvgCanvasController, eventDispatcher: EventDispatcher) {
        super(svgCanvasController, ToolType.RECTANGLE, false);
        this.eventDispatcher = eventDispatcher;
    }

    down() {
        super.down();
        this.canvasController.renderCanvas();
    }

    drag() {
        super.drag();
        
        this.canvasController.pixelModel.removePreviews();
        const type = this.canvasController.selectedWorldItemDefinition.typeName;
        const positions = this.getPositionsInSelection();
        positions.forEach(pos => this.canvasController.pixelModel.addPixel(pos, type, true, -1));

        this.canvasController.renderCanvas();
    }

    click() {
        super.click();
        const type = this.canvasController.selectedWorldItemDefinition.typeName;
        const layer = getLayerForType(type);
        this.canvasController.pixelModel.addPixel(this.canvasController.mouseController.movePoint, type, false, layer);

        this.canvasController.renderCanvas();
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }

    draggedUp() {
        super.draggedUp();
        this.canvasController.pixelModel.commitPreviews();

        this.canvasController.renderCanvas();
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
}