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
        this.svgCanvasController.render();
    }

    drag() {
        super.drag();
        
        this.svgCanvasController.pixelModel.removePreviews();
        const type = this.svgCanvasController.worldItemDefinitionForm.getModel().selectedType.typeName;
        const positions = this.getPositionsInSelection();
        positions.forEach(pos => this.svgCanvasController.pixelModel.addPixel(pos, type, true, -1));

        this.svgCanvasController.render();
    }

    up() {
        if (this.svgCanvasController.mouseController.isDrag) {
            this.svgCanvasController.pixelModel.commitPreviews();
        } else {
            const type = this.svgCanvasController.worldItemDefinitionForm.getModel().selectedType.typeName;
            const layer = getLayerForType(type);
            this.svgCanvasController.pixelModel.addPixel(this.svgCanvasController.mouseController.movePoint, type, false, layer);
        }

        super.up();

        this.svgCanvasController.render();
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
}