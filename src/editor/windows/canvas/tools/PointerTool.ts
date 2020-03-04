import { AbstractTool } from "./AbstractTool";
import { CanvasWindow } from "../CanvasWindow";
import { ToolType } from "./Tool";
import { UpdateTask } from "../../../common/services/UpdateServices";
import { ViewType, View } from "../models/views/View";
import { CanvasItemTag } from "../models/CanvasItem";
import { PathView } from "../models/views/PathView";
import { Stores } from '../../../Stores';

export class PointerTool extends AbstractTool {
    private controller: CanvasWindow;

    private selectableViews: ViewType[];
    private getStores: () => Stores;

    constructor(controller: CanvasWindow, getStores: () => Stores) {
        super(ToolType.POINTER);
        this.controller = controller;
        this.getStores = getStores;
    }

    click(): boolean {
        const hoveredView = this.getStores().viewStore.getHoveredView()

        if (
            hoveredView &&
            (!this.selectableViews || this.selectableViews.includes(hoveredView.viewType))
        ) {
            this.getStores().viewStore.removeSelectionAll();
            this.getStores().viewStore.addTag([hoveredView], CanvasItemTag.SELECTED);
            hoveredView.selectHoveredSubview();

            this.controller.updateService.scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas);
            
            return true;
        }
        return false;
    }

    down() {
        const hoveredView = this.getStores().viewStore.getHoveredView();
        if (hoveredView) {
            hoveredView.selectHoveredSubview();
            this.controller.updateService.scheduleTasks(UpdateTask.RepaintCanvas);
        }
    }

    over(item: View) {
        this.getStores().viewStore.addTag([item], CanvasItemTag.HOVERED);
        this.updateSubviewHover(item);
        this.controller.updateService.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    out(item: View) {
        this.getStores().viewStore.getHoveredView() && this.getStores().viewStore.getHoveredView().removeSubviewHover();
        this.getStores().viewStore.removeTagFromAll(CanvasItemTag.HOVERED);
        this.controller.updateService.scheduleTasks(UpdateTask.RepaintCanvas);
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