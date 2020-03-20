import { AbstractTool } from "./AbstractTool";
import { CanvasView, CanvasTag } from "../CanvasView";
import { ToolType } from "./Tool";
import { UpdateTask } from "../../../services/UpdateServices";
import { ConceptType, Concept, Subconcept } from "../models/concepts/Concept";
import { PathConcept } from "../models/concepts/PathConcept";
import { Stores } from '../../../stores/Stores';
import { ServiceLocator } from '../../../services/ServiceLocator';

export class PointerTool extends AbstractTool {
    private controller: CanvasView;

    private selectableViews: ConceptType[];
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
            (!this.selectableViews || this.selectableViews.includes(hoveredView.conceptType))
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

    setSelectableViews(views: ConceptType[]) {
        this.selectableViews = views;
    }
}