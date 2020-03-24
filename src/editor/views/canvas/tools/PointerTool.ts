import { AbstractTool } from "./AbstractTool";
import { CanvasView, CanvasTag } from "../CanvasView";
import { ToolType } from "./Tool";
import { UpdateTask } from "../../../services/UpdateServices";
import { Concept, Subconcept } from "../models/concepts/Concept";
import { Stores } from '../../../stores/Stores';
import { ServiceLocator } from '../../../services/ServiceLocator';
import { CanvasItemType } from "../models/CanvasItem";

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
        const hoveredView = this.getStores().conceptStore.getHoveredView()

        if (
            hoveredView &&
            (!this.selectableViews || this.selectableViews.includes(hoveredView.type))
        ) {
            this.getStores().conceptStore.removeSelectionAll();
            this.getStores().conceptStore.addTag([hoveredView], CanvasTag.Selected);
            hoveredView.selectHoveredSubview();

            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas);
            
            return true;
        }
        return false;
    }

    down() {
        const hoveredView = this.getStores().conceptStore.getHoveredView();
        if (hoveredView) {
            hoveredView.selectHoveredSubview();
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
        }
    }

    over(concept: Concept, subconcept?: Subconcept) {
        if (subconcept) {
            subconcept.over();
        }
        
        this.getStores().conceptStore.addTag([concept], CanvasTag.Hovered);
        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    out(concept: Concept, subconcept?: Subconcept) {
        if (subconcept) {
            subconcept.out();
        }
        this.getStores().conceptStore.removeTagFromAll(CanvasTag.Hovered);
        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    setSelectableViews(views: CanvasItemType[]) {
        this.selectableViews = views;
    }
}