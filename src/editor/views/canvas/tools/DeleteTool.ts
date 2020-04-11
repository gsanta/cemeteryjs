import { ServiceLocator } from '../../../services/ServiceLocator';
import { UpdateTask } from '../../../services/UpdateServices';
import { Stores } from '../../../stores/Stores';
import { CanvasView } from '../CanvasView';
import { Concept } from '../models/concepts/Concept';
import { Feedback } from '../models/feedbacks/Feedback';
import { AbstractTool } from './AbstractTool';
import { PointerTool } from './PointerTool';
import { RectangleSelector } from './selection/RectangleSelector';
import { ToolType } from './Tool';

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
                const concept = hoverStore.getConcept();
                this.getStores().canvasStore.removeConcept(concept);
                this.getServices().gameService().deleteConcepts([concept]);
            }
            
            this.getServices().levelService().updateCurrentLevel();
            hoverStore.hasAny() && this.getServices().updateService().scheduleTasks(UpdateTask.All, UpdateTask.SaveData);
        }
    }

    
    draggedUp() {
        const concepts = this.getStores().canvasStore.getIntersectingItemsInRect(this.view.feedbackStore.rectSelectFeedback.rect);

        concepts.forEach(item => this.getStores().canvasStore.removeConcept(item));

        this.rectSelector.finish();

        this.getServices().levelService().updateCurrentLevel();
        this.getServices().gameService().deleteConcepts(concepts);
        this.getServices().updateService().scheduleTasks(UpdateTask.All, UpdateTask.SaveData);
    }

    leave() {
        this.rectSelector.finish();
        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    over(item: Concept | Feedback) {
        this.view.getToolByType<PointerTool>(ToolType.POINTER).over(item);
    }

    out(item: Concept | Feedback) {
        this.view.getToolByType<PointerTool>(ToolType.POINTER).out(item);
    }

    eraseAll() {
        const concepts = this.getStores().canvasStore.getAllConcepts();
        this.getServices().gameService().deleteConcepts(concepts);
        this.getServices().storageService().clearAll();
        this.getStores().canvasStore.clear();
        this.getServices().updateService().runImmediately(UpdateTask.All);
    }
}
