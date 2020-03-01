import { UpdateTask } from '../../../common/services/UpdateServices';
import { ServiceLocator } from '../../../ServiceLocator';
import { CanvasWindow } from '../CanvasWindow';
import { AbstractTool } from './AbstractTool';
import { RectangleSelector } from './selection/RectangleSelector';
import { ToolType } from './Tool';
import { View } from '../models/views/View';

export class DeleteTool extends AbstractTool {
    private controller: CanvasWindow;
    private rectSelector: RectangleSelector;
    private services: ServiceLocator;

    constructor(controller: CanvasWindow, services: ServiceLocator) {
        super(ToolType.DELETE);
        this.controller = controller;
        this.services = services;
        this.rectSelector = new RectangleSelector(controller);
    }

    drag() {
        this.rectSelector.updateRect(this.controller.pointer.pointer);
        this.controller.updateService.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    click() {
        this.controller.toolService.pointerTool.click()
        const hovered = this.controller.stores.viewStore.getHoveredView();
        hovered && this.controller.stores.viewStore.remove(hovered);
        
        hovered && this.controller.updateService.scheduleTasks(UpdateTask.All);
    }

    
    draggedUp() {
        const canvasItems = this.controller.stores.viewStore.getIntersectingItemsInRect(this.controller.feedbackStore.rectSelectFeedback.rect);

        canvasItems.forEach(item => this.controller.stores.viewStore.remove(item));

        this.rectSelector.finish();

        this.controller.updateService.scheduleTasks(UpdateTask.All);
    }

    leave() {
        this.rectSelector.finish();
        this.controller.updateService.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    over(item: View) {
        this.controller.toolService.pointerTool.over(item);
    }

    out(item: View) {
        this.controller.toolService.pointerTool.out(item);
    }

    eraseAll() {
        this.services.storageService().clearAll();
        this.controller.stores.viewStore.clear();
        this.controller.updateService.runImmediately(UpdateTask.All);
    }
}
