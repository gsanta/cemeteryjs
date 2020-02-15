import { CanvasController } from '../CanvasController';
import { AbstractSelectionTool } from './AbstractSelectionTool';
import { ToolType } from './Tool';
import { EventDispatcher } from '../../../events/EventDispatcher';
import { Events } from '../../../events/Events';
import { Rectangle } from '../../../../../misc/geometry/shapes/Rectangle';
import { Controllers } from '../../../Controllers';

export class DeleteTool extends AbstractSelectionTool {
    private eventDispatcher: EventDispatcher;

    constructor(controller: CanvasController, eventDispatcher: EventDispatcher) {
        super(controller, ToolType.DELETE, true);
        
        this.eventDispatcher = eventDispatcher;
    }

    down() {
        super.down();
        this.services.renderWindow();
    }

    drag() {
        super.drag();
        this.services.renderWindow();
    }

    click() {
        super.click();
        const items = this.services.viewStore.getIntersectingItemsAtPoint(this.services.mouseController.pointer.curr);
        items.length > 0 && this.services.viewStore.remove(items[0]); 
        this.services.renderWindow();

        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
    
    draggedUp() {
        super.draggedUp();
        const canvasItems = this.services.viewStore.getIntersectingItemsInRect(this.getSelectionRect());

        canvasItems.forEach(item => this.services.viewStore.remove(item));

        this.services.renderWindow();

        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
}
