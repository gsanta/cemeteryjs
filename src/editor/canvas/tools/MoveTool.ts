import { Rectangle } from "../../../misc/geometry/shapes/Rectangle";
import { EventDispatcher } from "../../common/EventDispatcher";
import { Events } from '../../common/Events';
import { CanvasController } from "../CanvasController";
import { AbstractTool } from './AbstractTool';
import { ToolType, ToolReturnType } from './Tool';
import { View } from "../models/views/View";
import { UpdateTask } from "../services/CanvasUpdateServices";

export class MoveTool extends AbstractTool {
    private controller: CanvasController;

    private origDimensions: Rectangle[] = [];

    private isMoving = false;
    private isDragStart = true;

    constructor(controller: CanvasController) {
        super(ToolType.MOVE);
        this.controller = controller;
    }

    drag() {
        super.drag();

        if (this.isMoving) {
            this.moveItems();
            this.controller.updateService.addUpdateTasks(UpdateTask.RepaintCanvas);
        } else if (this.isDragStart) {
            this.initMove() && this.controller.updateService.addUpdateTasks(UpdateTask.RepaintCanvas);
        }

        this.isDragStart = false;
    }

    draggedUp() {
        super.draggedUp();

        if (!this.isDragStart) {
            this.controller.updateService.addUpdateTasks(UpdateTask.All);
        }

        this.isDragStart = true;
        this.isMoving = false;
    }

    leave() {
        this.isDragStart = true;
        this.isMoving = false;
    }

    private initMove(): boolean {
        const selected = this.controller.viewStore.getSelectedViews();
        this.origDimensions = [];
        
            this.origDimensions = selected.map(item => item.dimensions);

            this.isMoving = true;
            this.moveItems();
            return true;
    }

    private moveItems() {
        const selectedItems = this.controller.viewStore.getSelectedViews();
        const mouseDelta = this.controller.pointer.pointer.getDownDiff();

        selectedItems.forEach((item, index) => item.dimensions = this.origDimensions[index].translate(mouseDelta));

        this.controller.renderWindow();
    }
}