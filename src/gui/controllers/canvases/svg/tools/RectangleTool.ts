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
        this.svgCanvasController.renderCanvas();
    }

    drag() {
        super.drag();
        
        this.svgCanvasController.pixelModel.removePreviews();
        const type = this.svgCanvasController.selectedWorldItemDefinition.typeName;
        const positions = this.getPositionsInSelection();
        positions.forEach(pos => this.svgCanvasController.pixelModel.addPixel(pos, type, true, -1));

        this.svgCanvasController.renderCanvas();
    }

    click() {
        super.click();
        const type = this.svgCanvasController.selectedWorldItemDefinition.typeName;
        const layer = getLayerForType(type);
        this.svgCanvasController.pixelModel.addPixel(this.svgCanvasController.mouseController.movePoint, type, false, layer);

        this.svgCanvasController.renderCanvas();
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }

    draggedUp() {
        super.draggedUp();
        this.svgCanvasController.pixelModel.commitPreviews();

        this.svgCanvasController.renderCanvas();
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
}