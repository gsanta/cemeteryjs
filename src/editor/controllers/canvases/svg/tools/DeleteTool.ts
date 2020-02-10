import { CanvasController } from '../CanvasController';
import { AbstractSelectionTool } from './AbstractSelectionTool';
import { ToolType } from './Tool';
import { EventDispatcher } from '../../../events/EventDispatcher';
import { Events } from '../../../events/Events';
import { Rectangle } from '../../../../../misc/geometry/shapes/Rectangle';
import { EditorFacade } from '../../../EditorFacade';

export class DeleteTool extends AbstractSelectionTool {
    private eventDispatcher: EventDispatcher;

    constructor(services: EditorFacade, eventDispatcher: EventDispatcher) {
        super(services, ToolType.DELETE, true);
        
        this.eventDispatcher = eventDispatcher;
    }

    down() {
        super.down();
        this.services.svgCanvasController.renderCanvas();
    }

    drag() {
        super.drag();
        this.services.svgCanvasController.renderCanvas();
    }

    click() {
        super.click();
        const items = this.services.viewStore.getIntersectingItemsAtPoint(this.services.svgCanvasController.mouseController.pointer.curr);
        items.length > 0 && this.services.viewStore.remove(items[0]); 
        this.services.svgCanvasController.renderCanvas();

        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
    
    draggedUp() {
        super.draggedUp();
        const canvasItems = this.services.viewStore.getIntersectingItemsInRect(this.getSelectionRect());

        canvasItems.forEach(item => this.services.viewStore.remove(item));

        this.services.svgCanvasController.renderCanvas();

        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
}
