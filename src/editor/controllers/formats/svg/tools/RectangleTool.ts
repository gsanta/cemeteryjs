import { EventDispatcher } from '../../../events/EventDispatcher';
import { Events } from '../../../events/Events';
import { SvgCanvasController } from '../SvgCanvasController';
import { AbstractSelectionTool } from './AbstractSelectionTool';
import { ToolType } from './Tool';
import { CanvasItem } from '../models/SvgCanvasStore';

export class RectangleTool extends AbstractSelectionTool {
    private eventDispatcher: EventDispatcher;
    private lastPreviewRect: CanvasItem;

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
        
        if (this.lastPreviewRect) {
            this.canvasController.pixelModel.removeRectangle(this.lastPreviewRect);
        }
        const type = this.canvasController.selectedWorldItemDefinition.typeName;
        const positions = this.getPositionsInSelection();

        if (positions.length > 0) {
            this.lastPreviewRect = this.canvasController.pixelModel.addRectangle(positions, type, 0, true);
    
            this.canvasController.renderCanvas();
        }
    }

    draggedUp() {
        super.draggedUp();
        if (this.lastPreviewRect) {
            this.lastPreviewRect.isPreview = false;
            this.lastPreviewRect = null;
        }

        this.canvasController.renderCanvas();
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
}