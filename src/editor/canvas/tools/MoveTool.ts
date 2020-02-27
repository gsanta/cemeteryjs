import { Rectangle } from "../../../misc/geometry/shapes/Rectangle";
import { EventDispatcher } from "../../common/EventDispatcher";
import { Events } from '../../common/Events';
import { CanvasController } from "../CanvasController";
import { AbstractTool } from './AbstractTool';
import { ToolType } from './Tool';
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

        return false;
    }

    drag() {
        super.drag();

        if (this.isMoving) {
            this.moveItems();
            return true;
        } else if (this.isDragStart) {
            return this.initMove();
        }

        this.isDragStart = false;

        return false;
    }

    draggedUp() {
        super.draggedUp();
        let update = false;

        if (!this.isDragStart) {
            this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
            update = true;
        }

        this.isDragStart = true;
        this.isMoving = false;

        return update;
    }

    leave() {
        this.isDragStart = true;
        this.isMoving = false;
        return undefined;
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