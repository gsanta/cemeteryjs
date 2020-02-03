import { SvgCanvasController } from '../SvgCanvasController';
import { AbstractSelectionTool } from './AbstractSelectionTool';
import { ToolType } from './Tool';
import { EventDispatcher } from '../../../events/EventDispatcher';
import { Events } from '../../../events/Events';
import { Rectangle } from '../../../../../model/geometry/shapes/Rectangle';

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
        const items = this.canvasController.canvasStore.getIntersectingItemsAtPoint(this.canvasController.mouseController.pointer.curr);
        items.length > 0 && this.canvasController.canvasStore.remove(items[0]); 
        this.canvasController.renderCanvas();

        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
    
    draggedUp() {
        super.draggedUp();
        const canvasItems = this.canvasController.canvasStore.getIntersectingItemsInRect(this.getSelectionRect());

        canvasItems.forEach(item => this.canvasController.canvasStore.remove(item));

        this.canvasController.renderCanvas();

        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
}
