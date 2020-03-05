import { CanvasWindow } from "../CanvasWindow";
import { RectangleSelector } from "./selection/RectangleSelector";
import { ToolType, Tool } from "./Tool";
import { AbstractTool } from "./AbstractTool";
import { UpdateTask } from "../../../common/services/UpdateServices";
import { CanvasItemTag } from "../models/CanvasItem";
import { View } from "../models/views/View";
import { Stores } from '../../../Stores';
import { ServiceLocator } from '../../../ServiceLocator';

export class SelectTool extends AbstractTool {
    protected controller: CanvasWindow;
    private rectSelector: RectangleSelector;

    private activeTool: Tool;
    private getStores: () => Stores;
    private getServices: () => ServiceLocator;

    constructor(controller: CanvasWindow, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(ToolType.SELECT);
        this.controller = controller;
        this.getStores = getStores;
        this.getServices = getServices;
        this.rectSelector = new RectangleSelector(controller);
    }

    down() {
        const hovered = this.getStores().viewStore.getHoveredView();
        const selected = this.getStores().viewStore.getSelectedViews();

        if (hovered && selected.includes(hovered)) {
            this.activeTool = this.controller.toolService.moveTool;
        }
    }

    click() {
        if (this.getStores().viewStore.getHoveredView()) {
            this.controller.toolService.pointerTool.click();
        } else if (this.getStores().viewStore.getSelectedViews().length > 0) {
            this.getStores().viewStore.removeTag(this.getStores().viewStore.getViews(), CanvasItemTag.SELECTED);
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
        }
    }

    drag() {
        if (this.activeTool) {
            this.activeTool.drag();
        } else {
            this.rectSelector.updateRect(this.controller.pointer.pointer);
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
        }
    }

    draggedUp() {
        if (this.activeTool) {
            this.activeTool.draggedUp();
            this.activeTool = undefined;
            return;
        }

        const feedback = this.controller.feedbackStore.rectSelectFeedback;
        if (!feedback) { return }

        const canvasItems = this.getStores().viewStore.getIntersectingItemsInRect(feedback.rect);
        const canvasStore = this.getStores().viewStore;
        
        canvasStore.removeTag(this.getStores().viewStore.getViews(), CanvasItemTag.SELECTED);
        canvasStore.addTag(canvasItems, CanvasItemTag.SELECTED);

        this.rectSelector.finish();
        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    over(item: View) {
        this.controller.toolService.pointerTool.over(item);
    }

    out(item: View) {
        this.controller.toolService.pointerTool.out(item);
    }
}