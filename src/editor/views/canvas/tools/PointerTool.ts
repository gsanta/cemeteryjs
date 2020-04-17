import { ServiceLocator } from '../../../services/ServiceLocator';
import { UpdateTask } from "../../../services/UpdateServices";
import { Stores } from '../../../stores/Stores';
import { AbstractTool } from "./AbstractTool";
import { ToolType } from "./Tool";
import { Concept } from '../models/concepts/Concept';
import { Feedback } from '../models/feedbacks/Feedback';
import { VisualConcept } from '../models/concepts/VisualConcept';
import { isFeedback, isConcept } from '../../../stores/CanvasStore';

export class PointerTool extends AbstractTool {
    protected movingItem: Concept | Feedback = undefined;
    private isDragStart = true;

    constructor(getServices: () => ServiceLocator, getStores: () => Stores, toolType: ToolType) {
        super(toolType, getServices, getStores);
        this.getStores = getStores;
        this.getServices = getServices;
    }

    click(): void {
        const hoverStore = this.getStores().hoverStore;

        const feedback = hoverStore.getFeedback();
        let concept = hoverStore.getConcept(); 
        if (feedback) {
            const concept = hoverStore.getFeedback().parent;
            this.getStores().selectionStore.clear();
            this.getStores().selectionStore.addItem(concept);
            this.getStores().selectionStore.addItem(feedback);

            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas);
        } else if (concept) {
            this.getStores().selectionStore.clear();
            this.getStores().selectionStore.addItem(concept);

            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas);

        }
    }

    down() {
        this.initMove() && this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    drag() {
        super.drag();

        if (this.movingItem) {
            this.moveItems();
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
        }
        
        this.isDragStart = false;
    }

    draggedUp() {
        super.draggedUp();

        if (!this.isDragStart) {
            this.getServices().updateService().scheduleTasks(UpdateTask.SaveData, UpdateTask.All);
        }

        this.isDragStart = true;
        
        this.updateGameObjects();
        this.movingItem = undefined;
        this.getServices().levelService().updateCurrentLevel();
    }

    leave() {
        this.isDragStart = true;
        this.movingItem = undefined;
    }

    over(item: VisualConcept | Feedback) {
        this.getStores().hoverStore.addItem(item);
        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    out(item: VisualConcept | Feedback) {
        this.getStores().hoverStore.removeItem(item);
        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    private initMove(): boolean {
        const hovered = this.getStores().hoverStore.getAny();
        this.movingItem = hovered;
        this.moveItems();
        return true;
    }

    private moveItems() {
        const concepts = this.getStores().selectionStore.getAllConcepts();

        if (isFeedback(this.movingItem.type)) {
            concepts[0].moveEditPoint(this.getStores().selectionStore.getEditPoint(), this.getServices().pointerService().pointer.getDiff());
        } else if (isConcept(this.movingItem.type)) {
            concepts.forEach((item, index) => item.move(this.getServices().pointerService().pointer.getDiff()));
        }

        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    private updateGameObjects() {
        let concepts: Concept[];

        if (isFeedback(this.movingItem.type)) {
            concepts = [(<Feedback> this.movingItem).parent];
        } else {
            concepts = this.getStores().selectionStore.getAllConcepts();
        }

        this.getServices().gameService().updateConcepts(concepts);
    }
}