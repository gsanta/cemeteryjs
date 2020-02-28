import { Rectangle } from "../../../misc/geometry/shapes/Rectangle";
import { EventDispatcher } from "../../common/EventDispatcher";
import { Events } from '../../common/Events';
import { CanvasController } from "../CanvasController";
import { AbstractTool } from './AbstractTool';
import { ToolType, ToolReturnType } from './Tool';
import { View } from "../models/views/View";

export class MoveTool extends AbstractTool {
    private eventDispatcher: EventDispatcher;
    private controller: CanvasController;

    private origDimensions: Rectangle[] = [];

    private isMoving = false;
    private isDragStart = true;
    private hoveredAtDown: View;

    constructor(controller: CanvasController, eventDispatcher: EventDispatcher) {
        super(ToolType.MOVE);
        this.eventDispatcher = eventDispatcher;
        this.controller = controller;
    }

    down() {
        this.hoveredAtDown = this.controller.viewStore.getHoveredView(); 
    }

    drag() {
        super.drag();

        if (this.isMoving) {
            this.moveItems();
            this.controller.updateContent();
        } else if (this.isDragStart) {
            this.initMove() && this.controller.updateContent();
        }

        this.isDragStart = false;
    }

    draggedUp() {
        super.draggedUp();
        const ret = new ToolReturnType();

        if (!this.isDragStart) {
            this.controller.updateContent();
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
        
        if (selected.includes(this.hoveredAtDown)) {
            this.origDimensions = selected.map(item => item.dimensions);

            this.isMoving = true;
            this.moveItems();
            return true;
        }
    }

    private moveItems() {
        const selectedItems = this.controller.viewStore.getSelectedViews();
        const mouseDelta = this.controller.pointer.pointer.getDownDiff();

        selectedItems.forEach((item, index) => item.dimensions = this.origDimensions[index].translate(mouseDelta));

        this.controller.renderWindow();
    }
}