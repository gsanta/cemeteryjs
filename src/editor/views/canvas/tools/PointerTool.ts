import { AbstractTool } from "./AbstractTool";
import { CanvasView } from "../CanvasView";
import { ToolType } from "./Tool";
import { UpdateTask } from "../../../services/UpdateServices";
import { ConceptType, Concept } from "../models/concepts/Concept";
import { CanvasItemTag } from "../models/CanvasItem";
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
            this.getStores().conceptStore.addTag([hoveredView], CanvasItemTag.SELECTED);
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

    over(item: Concept) {
        this.getStores().conceptStore.addTag([item], CanvasItemTag.HOVERED);
        this.updateSubviewHover(item);
        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    out(item: Concept) {
        this.getStores().conceptStore.getHoveredView() && this.getStores().conceptStore.getHoveredView().removeSubviewHover();
        this.getStores().conceptStore.removeTagFromAll(CanvasItemTag.HOVERED);
        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    setSelectableViews(views: ConceptType[]) {
        this.selectableViews = views;
    }

    private updateSubviewHover(item: Concept) {
        switch(item.conceptType) {
            case ConceptType.Path:
                (<PathConcept> item).updateSubviewHover(this.getServices().pointerService().pointer.curr);
                break;
        }
    }
}