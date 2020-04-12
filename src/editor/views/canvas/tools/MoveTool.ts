import { Rectangle } from "../../../../misc/geometry/shapes/Rectangle";
import { UpdateTask } from "../../../services/UpdateServices";
import { CanvasView } from "../CanvasView";
import { AbstractTool } from './AbstractTool';
import { ToolType } from './Tool';
import { Stores } from '../../../stores/Stores';
import { ServiceLocator } from '../../../services/ServiceLocator';
import { isFeedback, isConcept } from "../../../stores/CanvasStore";
import { Concept } from "../models/concepts/Concept";
import { Feedback } from "../models/feedbacks/Feedback";

export class MoveTool extends AbstractTool {
    private movingItem = undefined;
    private isDragStart = true;
    private getStores: () => Stores;
    private getServices: () => ServiceLocator;

    constructor(controller: CanvasView, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(ToolType.MOVE);
        this.getStores = getStores;
        this.getServices = getServices;
    }

    down() {
        super.down();

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

    private initMove(): boolean {
        const hovered = this.getStores().hoverStore.getAny();
        this.movingItem = hovered;
        this.moveItems();
        return true;
    }

    private moveItems() {
        const concepts = this.getStores().selectionStore.getAllConcepts();

        if (isFeedback(this.movingItem)) {
            concepts[0].moveEditPoint(this.getStores().selectionStore.getEditPoint(), this.getServices().pointerService().pointer.getDiff());
        } else if (isConcept(this.movingItem)) {
            concepts.forEach((item, index) => item.move(this.getServices().pointerService().pointer.getDiff()));
        }

        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    private updateGameObjects() {
        let concepts: Concept[];

        if (isFeedback(this.movingItem)) {
            concepts = [(<Feedback> this.movingItem).parent];
        } else {
            concepts = this.getStores().selectionStore.getAllConcepts();
        }

        this.getServices().gameService().updateConcepts(concepts);
    }
}