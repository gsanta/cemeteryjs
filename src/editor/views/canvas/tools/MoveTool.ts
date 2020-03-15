import { Rectangle } from "../../../../misc/geometry/shapes/Rectangle";
import { UpdateTask } from "../../../services/UpdateServices";
import { CanvasView } from "../CanvasView";
import { AbstractTool } from './AbstractTool';
import { ToolType } from './Tool';
import { Stores } from '../../../stores/Stores';
import { ServiceLocator } from '../../../services/ServiceLocator';

export class MoveTool extends AbstractTool {
    private controller: CanvasView;

    private origDimensions: Rectangle[] = [];

    private isMoving = false;
    private isDragStart = true;
    private getStores: () => Stores;
    private getServices: () => ServiceLocator;

    constructor(controller: CanvasView, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(ToolType.MOVE);
        this.controller = controller;
        this.getStores = getStores;
        this.getServices = getServices;
    }

    drag() {
        super.drag();

        if (this.isMoving) {
            this.moveItems();
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
        } else if (this.isDragStart) {
            this.initMove() && this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
        }

        this.isDragStart = false;
    }

    draggedUp() {
        super.draggedUp();

        if (!this.isDragStart) {
            this.getServices().updateService().scheduleTasks(UpdateTask.SaveData, UpdateTask.All);
        }

        this.isDragStart = true;
        this.isMoving = false;

        this.getServices().levelService().updateCurrentLevel();
    }

    leave() {
        this.isDragStart = true;
        this.isMoving = false;
    }

    private initMove(): boolean {
        const selected = this.getStores().conceptStore.getSelectedViews();
        this.origDimensions = [];
        
        this.origDimensions = selected.map(item => item.dimensions);

        this.isMoving = true;
        this.moveItems();
        return true;
    }

    private moveItems() {
        const selectedItems = this.getStores().conceptStore.getSelectedViews();

        selectedItems.forEach((item, index) => item.move(this.getServices().pointerService().pointer.getDiff()));

        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }
}