import { UpdateTask } from '../../../services/UpdateServices';
import { ServiceLocator } from '../../../services/ServiceLocator';
import { CanvasView } from '../CanvasView';
import { AbstractTool } from './AbstractTool';
import { RectangleSelector } from './selection/RectangleSelector';
import { ToolType } from './Tool';
import { Concept, Subconcept } from '../models/concepts/Concept';
import { Stores } from '../../../stores/Stores';
import { PointerTool } from './PointerTool';
import { CanvasItem } from '../models/CanvasItem';

export class DeleteTool extends AbstractTool {
    private view: CanvasView;
    private rectSelector: RectangleSelector;
    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(view: CanvasView, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(ToolType.DELETE);
        this.view = view;
        this.getServices = getServices;
        this.getStores = getStores;
        this.rectSelector = new RectangleSelector(view);
    }

    drag() {
        this.rectSelector.updateRect(this.getServices().pointerService().pointer);
        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    click() {
        this.view.getToolByType<PointerTool>(ToolType.POINTER).click()
        const hoverStore = this.getStores().hoverStore;

        if (hoverStore.hasAny()) {
            if (hoverStore.hasEditPoint()) {
                hoverStore.getConcept().deleteEditPoint(hoverStore.getEditPoint());
            } else {
                this.getStores().canvasStore.removeConcept(hoverStore.getConcept());
            }
            
            this.getServices().levelService().updateCurrentLevel();
            hoverStore.hasAny() && this.getServices().updateService().scheduleTasks(UpdateTask.All, UpdateTask.SaveData);
        }
    }

    
    draggedUp() {
        const canvasItems = this.getStores().canvasStore.getIntersectingItemsInRect(this.view.feedbackStore.rectSelectFeedback.rect);

        canvasItems.forEach(item => this.getStores().canvasStore.removeConcept(item));

        this.rectSelector.finish();

        this.getServices().levelService().updateCurrentLevel();
        this.getServices().updateService().scheduleTasks(UpdateTask.All, UpdateTask.SaveData);
    }

    leave() {
        this.rectSelector.finish();
        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    over(canvasItem: CanvasItem) {
        this.view.getToolByType<PointerTool>(ToolType.POINTER).over(canvasItem);
    }

    out(canvasItem: CanvasItem) {
        this.view.getToolByType<PointerTool>(ToolType.POINTER).out(canvasItem);
    }

    eraseAll() {
        this.getServices().storageService().clearAll();
        this.getStores().canvasStore.clear();
        this.getServices().levelService().updateCurrentLevel();
        this.getServices().updateService().runImmediately(UpdateTask.All);
    }
}
