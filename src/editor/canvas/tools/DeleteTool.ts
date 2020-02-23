import { CanvasController } from '../CanvasController';
import { AbstractSelectionTool } from './AbstractSelectionTool';
import { ToolType } from './Tool';
import { EventDispatcher } from '../../common/EventDispatcher';
import { Events } from '../../common/Events';

export class DeleteTool extends AbstractSelectionTool {
    private eventDispatcher: EventDispatcher;

    constructor(controller: CanvasController, eventDispatcher: EventDispatcher) {
        super(controller, ToolType.DELETE, true);
        
        this.eventDispatcher = eventDispatcher;
    }

    down() {
        return super.down();
    }

    drag() {
        super.drag();
        this.controller.renderWindow();
    }

    click(): boolean {
        if (!super.click()) {
            const hovered = this.controller.viewStore.getHoveredView();
            hovered && this.controller.viewStore.remove(hovered);
            this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
            return !!hovered;
        }

        return true;
    }
    
    draggedUp() {
        super.draggedUp();
        const canvasItems = this.controller.viewStore.getIntersectingItemsInRect(this.getSelectionRect());

        canvasItems.forEach(item => this.controller.viewStore.remove(item));

        this.controller.renderWindow();

        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
}
