import { UpdateTask } from '../../../common/services/UpdateServices';
import { ServiceLocator } from '../../../ServiceLocator';
import { CanvasWindow } from '../CanvasWindow';
import { AbstractTool } from './AbstractTool';
import { RectangleSelector } from './selection/RectangleSelector';
import { ToolType } from './Tool';
import { View } from '../models/views/View';
import { Stores } from '../../../Stores';

export class DeleteTool extends AbstractTool {
    private controller: CanvasWindow;
    private rectSelector: RectangleSelector;
    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(controller: CanvasWindow, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(ToolType.DELETE);
        this.controller = controller;
        this.getServices = getServices;
        this.getStores = getStores;
        this.rectSelector = new RectangleSelector(controller);
    }

    drag() {
        this.rectSelector.updateRect(this.controller.pointer.pointer);
        this.controller.updateService.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    click() {
        this.controller.toolService.pointerTool.click()
        const hovered = this.getStores().viewStore.getHoveredView();
        hovered && this.getStores().viewStore.remove(hovered);
        
        this.getServices().levelService().updateCurrentLevel();
        hovered && this.controller.updateService.scheduleTasks(UpdateTask.All);
    }

    
    draggedUp() {
        const canvasItems = this.getStores().viewStore.getIntersectingItemsInRect(this.controller.feedbackStore.rectSelectFeedback.rect);

        canvasItems.forEach(item => this.getStores().viewStore.remove(item));

        this.rectSelector.finish();

        this.getServices().levelService().updateCurrentLevel();
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
        this.getServices().storageService().clearAll();
        this.getStores().viewStore.clear();
        this.getServices().levelService().updateCurrentLevel();
        this.controller.updateService.runImmediately(UpdateTask.All);
    }
}
