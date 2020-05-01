import { ServiceLocator } from '../ServiceLocator';
import { UpdateTask } from "../UpdateServices";
import { Stores } from '../../stores/Stores';
import { AbstractTool } from "./AbstractTool";
import { ToolType } from "./Tool";
import { Concept } from '../../views/canvas/models/concepts/Concept';
import { Feedback } from '../../views/canvas/models/feedbacks/Feedback';
import { VisualConcept } from '../../views/canvas/models/concepts/VisualConcept';
import { isFeedback, isConcept } from '../../stores/CanvasStore';
import { Registry } from '../../Registry';

export class PointerTool extends AbstractTool {
    protected movingItem: Concept | Feedback = undefined;
    private isDragStart = true;

    constructor(toolType: ToolType, registry: Registry) {
        super(toolType, registry);
    }

    click(): void {
        const hoverStore = this.registry.stores.hoverStore;

        const feedback = hoverStore.getFeedback();
        let concept = hoverStore.getConcept(); 
        if (feedback) {
            const concept = hoverStore.getFeedback().parent;
            this.registry.stores.selectionStore.clear();
            this.registry.stores.selectionStore.addItem(concept);
            this.registry.stores.selectionStore.addItem(feedback);

            this.registry.services.update.scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas);
        } else if (concept) {
            this.registry.stores.selectionStore.clear();
            this.registry.stores.selectionStore.addItem(concept);

            this.registry.services.update.scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas);

        }
    }

    down() {
        this.initMove() && this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    drag() {
        super.drag();

        if (this.movingItem) {
            this.moveItems();
            this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
        }
        
        this.isDragStart = false;
    }

    draggedUp() {
        super.draggedUp();

        if (!this.isDragStart) {
            this.registry.services.update.scheduleTasks(UpdateTask.SaveData, UpdateTask.All);
        }

        this.isDragStart = true;
        
        this.updateGameObjects();
        this.movingItem = undefined;
        this.registry.services.level.updateCurrentLevel();
    }

    leave() {
        this.isDragStart = true;
        this.movingItem = undefined;
    }

    over(item: VisualConcept | Feedback) {
        this.registry.stores.hoverStore.addItem(item);
        this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    out(item: VisualConcept | Feedback) {
        this.registry.stores.hoverStore.removeItem(item);
        this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    private initMove(): boolean {
        const hovered = this.registry.stores.hoverStore.getAny();
        this.movingItem = hovered;
        this.moveItems();
        return true;
    }

    private moveItems() {
        const concepts = this.registry.stores.selectionStore.getAllConcepts();

        if (isFeedback(this.movingItem.type)) {
            concepts[0].moveEditPoint(this.registry.stores.selectionStore.getEditPoint(), this.registry.services.pointer.pointer.getDiff());
        } else if (isConcept(this.movingItem.type)) {
            concepts.forEach((item, index) => item.move(this.registry.services.pointer.pointer.getDiff()));
        }

        this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    private updateGameObjects() {
        let concepts: Concept[];

        if (isFeedback(this.movingItem.type)) {
            concepts = [(<Feedback> this.movingItem).parent];
        } else {
            concepts = this.registry.stores.selectionStore.getAllConcepts();
        }

        this.registry.services.game.updateConcepts(concepts);
    }
}