import { AbstractTool } from "./AbstractTool";
import { CanvasWindow } from "../CanvasWindow";
import { ToolType } from "./Tool";
import { UpdateTask } from "../../../services/UpdateServices";
import { ConceptType, Concept } from "../models/concepts/Concept";
import { CanvasItemTag } from "../models/CanvasItem";
import { PathConcept } from "../models/concepts/PathConcept";
import { Stores } from '../../../stores/Stores';
import { ServiceLocator } from '../../../services/ServiceLocator';

export class PointerTool extends AbstractTool {
    private controller: CanvasWindow;

    private selectableViews: ConceptType[];
    private getStores: () => Stores;
    private getServices: () => ServiceLocator;

    constructor(controller: CanvasWindow, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(ToolType.POINTER);
        this.controller = controller;
        this.getStores = getStores;
        this.getServices = getServices;
    }

    click(): boolean {
        const hoveredView = this.getStores().viewStore.getHoveredView()

        if (
            hoveredView &&
            (!this.selectableViews || this.selectableViews.includes(hoveredView.conceptType))
        ) {
            this.getStores().viewStore.removeSelectionAll();
            this.getStores().viewStore.addTag([hoveredView], CanvasItemTag.SELECTED);
            hoveredView.selectHoveredSubview();

            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas);
            
            return true;
        }
        return false;
    }

    down() {
        const hoveredView = this.getStores().viewStore.getHoveredView();
        if (hoveredView) {
            hoveredView.selectHoveredSubview();
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
        }
    }

    over(item: Concept) {
        this.getStores().viewStore.addTag([item], CanvasItemTag.HOVERED);
        this.updateSubviewHover(item);
        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    out(item: Concept) {
        this.getStores().viewStore.getHoveredView() && this.getStores().viewStore.getHoveredView().removeSubviewHover();
        this.getStores().viewStore.removeTagFromAll(CanvasItemTag.HOVERED);
        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    setSelectableViews(views: ConceptType[]) {
        this.selectableViews = views;
    }

    private updateSubviewHover(item: Concept) {
        switch(item.conceptType) {
            case ConceptType.Path:
                (<PathConcept> item).updateSubviewHover(this.controller.pointer.pointer.curr);
                break;
        }
    }
}