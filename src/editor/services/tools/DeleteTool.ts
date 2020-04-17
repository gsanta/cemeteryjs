import { ServiceLocator } from '../ServiceLocator';
import { UpdateTask } from '../UpdateServices';
import { Stores } from '../../stores/Stores';
import { CanvasView } from '../../views/canvas/CanvasView';
import { Concept } from '../../views/canvas/models/concepts/Concept';
import { Feedback } from '../../views/canvas/models/feedbacks/Feedback';
import { AbstractTool } from './AbstractTool';
import { PointerTool } from './PointerTool';
import { RectangleSelector } from './RectangleSelector';
import { ToolType } from './Tool';
import { VisualConcept } from '../../views/canvas/models/concepts/VisualConcept';

export class DeleteTool extends AbstractTool {
    private rectSelector: RectangleSelector;

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        super(ToolType.DELETE, getServices, getStores);
        this.getServices = getServices;
        this.getStores = getStores;
        this.rectSelector = new RectangleSelector(getStores);
    }

    drag() {
        this.rectSelector.updateRect(this.getServices().pointer.pointer);
        this.getServices().update.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    click() {
        this.getServices().tools.pointer.click();
        const hoverStore = this.getStores().hoverStore;

        if (hoverStore.hasAny()) {
            if (hoverStore.hasEditPoint()) {
                hoverStore.getConcept().deleteEditPoint(hoverStore.getEditPoint());
            } else {
                const concept = hoverStore.getConcept();
                this.getStores().canvasStore.removeConcept(concept);
                this.getServices().game.deleteConcepts([concept]);
            }
            
            this.getServices().level.updateCurrentLevel();
            hoverStore.hasAny() && this.getServices().update.scheduleTasks(UpdateTask.All, UpdateTask.SaveData);
        }
    }

    
    draggedUp() {
        const concepts = this.getStores().canvasStore.getIntersectingItemsInRect(this.getStores().feedback.rectSelectFeedback.rect);

        concepts.forEach((item: VisualConcept) => this.getStores().canvasStore.removeConcept(item));

        this.rectSelector.finish();

        this.getServices().level.updateCurrentLevel();
        this.getServices().game.deleteConcepts(concepts);
        this.getServices().update.scheduleTasks(UpdateTask.All, UpdateTask.SaveData);
    }

    leave() {
        this.rectSelector.finish();
        this.getServices().update.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    over(item: VisualConcept | Feedback) {
        this.getServices().tools.pointer.over(item);
    }

    out(item: VisualConcept | Feedback) {
        this.getServices().tools.pointer.out(item);
    }

    eraseAll() {
        const concepts = this.getStores().canvasStore.getAllConcepts();
        this.getServices().game.deleteConcepts(concepts);
        this.getServices().storage.clearAll();
        this.getStores().canvasStore.clear();
        this.getServices().update.runImmediately(UpdateTask.All);
    }
}
