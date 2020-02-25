import { CanvasController } from '../CanvasController';
import { ToolType } from './Tool';
import { EventDispatcher } from '../../common/EventDispatcher';
import { Events } from '../../common/Events';
import { AbstractTool } from './AbstractTool';
import { RectangleSelector } from './selection/RectangleSelector';

export class DeleteTool extends AbstractTool {
    private eventDispatcher: EventDispatcher;
    private controller: CanvasController;
    private rectSelector: RectangleSelector;

    constructor(controller: CanvasController, eventDispatcher: EventDispatcher) {
        super(ToolType.DELETE);
        this.controller = controller;
        this.eventDispatcher = eventDispatcher;
        this.rectSelector = new RectangleSelector(controller);
    }

    drag() {
        this.rectSelector.updateRect(this.controller.pointer.pointer);
        return true;
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
        const canvasItems = this.controller.viewStore.getIntersectingItemsInRect(this.controller.feedbackStore.rectSelectFeedback.rect);

        canvasItems.forEach(item => this.controller.viewStore.remove(item));

        this.rectSelector.finish();

        this.controller.renderWindow();
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }

    leave() {
        this.rectSelector.finish();
    }
}
