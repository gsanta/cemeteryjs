import { ServiceLocator } from '../../../services/ServiceLocator';
import { UpdateTask } from "../../../services/UpdateServices";
import { Stores } from '../../../stores/Stores';
import { AbstractTool } from "./AbstractTool";
import { ToolType } from "./Tool";
import { Concept } from '../models/concepts/Concept';
import { Feedback } from '../models/feedbacks/Feedback';
import { VisualConcept } from '../models/concepts/VisualConcept';

export class PointerTool extends AbstractTool {
    private getStores: () => Stores;
    private getServices: () => ServiceLocator;

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        super(ToolType.POINTER);
        this.getStores = getStores;
        this.getServices = getServices;
    }

    click(): boolean {
        const hoverStore = this.getStores().hoverStore;
        const selectionStore = this.getStores().selectionStore;

        const feedback = hoverStore.getFeedback();
        let concept = hoverStore.getConcept(); 
        if (feedback) {
            const concept = hoverStore.getFeedback().parent;
            this.getStores().selectionStore.clear();
            this.getStores().selectionStore.addItem(concept);
            this.getStores().selectionStore.addItem(feedback);

            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas);
            
            return true;
        } else if (concept) {
            this.getStores().selectionStore.clear();
            this.getStores().selectionStore.addItem(concept);

            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas);

        }

        return false;
    }

    over(item: VisualConcept | Feedback) {
        this.getStores().hoverStore.addItem(item);
        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    out(item: VisualConcept | Feedback) {
        this.getStores().hoverStore.removeItem(item);
        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }
}