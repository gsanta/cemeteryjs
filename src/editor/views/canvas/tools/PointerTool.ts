import { AbstractTool } from "./AbstractTool";
import { CanvasView, CanvasTag } from "../CanvasView";
import { ToolType } from "./Tool";
import { UpdateTask } from "../../../services/UpdateServices";
import { Concept, Subconcept } from "../models/concepts/Concept";
import { Stores } from '../../../stores/Stores';
import { ServiceLocator } from '../../../services/ServiceLocator';
import { CanvasItemType, CanvasItem } from "../models/CanvasItem";

export class PointerTool extends AbstractTool {
    private controller: CanvasView;

    private selectableViews: CanvasItemType[];
    private getStores: () => Stores;
    private getServices: () => ServiceLocator;

    constructor(controller: CanvasView, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(ToolType.POINTER);
        this.controller = controller;
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

    over(canvasItem: CanvasItem) {
        this.getStores().hoverStore.addItem(canvasItem);
        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    out(canvasItem: CanvasItem) {
        this.getStores().hoverStore.removeItem(canvasItem);
        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    setSelectableViews(views: CanvasItemType[]) {
        this.selectableViews = views;
    }
}