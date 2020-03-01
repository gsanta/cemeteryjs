import { AbstractTool } from "./AbstractTool";
import { View, ViewType } from "../models/views/View";
import { CanvasController } from "../CanvasController";
import { ToolType } from "./Tool";
import { CanvasItemTag } from "../models/CanvasItem";
import { PathView } from "../models/views/PathView";
import { UpdateTask } from "../services/CanvasUpdateServices";

export class PointerTool extends AbstractTool {
    private controller: CanvasController;

    private selectableViews: ViewType[];

    constructor(controller: CanvasController) {
        super(ToolType.POINTER);
        this.controller = controller;
    }

    click(): boolean {
        const hoveredView = this.controller.viewStore.getHoveredView()

        if (
            hoveredView &&
            (!this.selectableViews || this.selectableViews.includes(hoveredView.viewType))
        ) {
            this.controller.viewStore.removeSelectionAll();
            this.controller.viewStore.addTag([hoveredView], CanvasItemTag.SELECTED);
            hoveredView.selectHoveredSubview();

            this.controller.updateService.addUpdateTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas);
            
            return true;
        }
        return false;
    }

    down() {
        const hoveredView = this.controller.viewStore.getHoveredView();
        if (hoveredView) {
            hoveredView.selectHoveredSubview();
            this.controller.updateService.addUpdateTasks(UpdateTask.RepaintCanvas);
        }
    }

    over(item: View) {
        this.controller.viewStore.addTag([item], CanvasItemTag.HOVERED);
        this.updateSubviewHover(item);
        this.controller.updateService.addUpdateTasks(UpdateTask.RepaintCanvas);
    }

    out(item: View) {
        this.controller.viewStore.getHoveredView() && this.controller.viewStore.getHoveredView().removeSubviewHover();
        this.controller.viewStore.removeTagFromAll(CanvasItemTag.HOVERED);
        this.controller.updateService.addUpdateTasks(UpdateTask.RepaintCanvas);
    }

    setSelectableViews(views: ViewType[]) {
        this.selectableViews = views;
    }

    private updateSubviewHover(item: View) {
        switch(item.viewType) {
            case ViewType.Path:
                (<PathView> item).updateSubviewHover(this.controller.pointer.pointer.curr);
                break;
        }
    }
}