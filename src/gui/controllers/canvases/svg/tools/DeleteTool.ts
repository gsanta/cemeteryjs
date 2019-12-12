import { SvgCanvasController } from '../SvgCanvasController';
import { AbstractSelectionTool } from './AbstractSelectionTool';
import { ToolType } from './Tool';
import { Rectangle } from '@nightshifts.inc/geometry';
import { EventDispatcher } from '../../../events/EventDispatcher';
import { Events } from '../../../events/Events';

export class DeleteTool extends AbstractSelectionTool {
    private eventDispatcher: EventDispatcher;

    constructor(bitmapEditor: SvgCanvasController, eventDispatcher: EventDispatcher) {
        super(bitmapEditor, ToolType.DELETE, true);
        
        this.eventDispatcher = eventDispatcher;
    }

    down() {
        super.down();
        this.canvasController.renderCanvas();
    }

    drag() {
        super.drag();
        this.canvasController.renderCanvas();
    }

    click() {
        super.click();
        const items = this.canvasController.pixelModel.getIntersectingItemsAtPoint(this.canvasController.mouseController.movePoint);
        items.length > 0 && this.canvasController.pixelModel.removeRectangle(items[0]); 
        this.canvasController.renderCanvas();

        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
    
    draggedUp() {
        super.draggedUp();
        const selectionRect = this.canvasController.selectionModel.getSelectionRect();
        const rectangle = new Rectangle(selectionRect.topLeft, selectionRect.bottomRight);
        const canvasItems = this.canvasController.pixelModel.getIntersectingItemsInRect(rectangle);

        canvasItems.forEach(item => this.canvasController.pixelModel.removeRectangle(item));

        this.canvasController.renderCanvas();

        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
}
