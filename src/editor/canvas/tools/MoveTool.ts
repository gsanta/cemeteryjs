import { Rectangle } from "../../../misc/geometry/shapes/Rectangle";
import { EventDispatcher } from "../../common/EventDispatcher";
import { Events } from '../../common/Events';
import { CanvasController } from "../CanvasController";
import { AbstractTool } from './AbstractTool';
import { ToolType } from './Tool';

export class MoveTool extends AbstractTool {
    private eventDispatcher: EventDispatcher;
    private controller: CanvasController;

    private origDimensions: Rectangle[] = [];

    private isMoving = false;
    private isDragStart = true;

    constructor(controller: CanvasController, eventDispatcher: EventDispatcher) {
        super(ToolType.MOVE);
        this.eventDispatcher = eventDispatcher;
        this.controller = controller;
    }

    // down() {
    //     super.down();

    //     const canvasStore = this.controller.viewStore;

    //     const selectedItems = canvasStore.getSelectedViews();
    //     this.origDimensions = [];

    //     if (selectedItems.length) {
    //         this.origDimensions = selectedItems.map(item => item.dimensions);
    //         return true;
    //     }

    //     return false;
    // }

    drag() {
        super.drag();

        if (this.isMoving) {
            this.moveItems();
            return true;
        } else if (this.isDragStart) {
            const hovered = this.controller.viewStore.getHoveredView();
            const selected = this.controller.viewStore.getSelectedViews();
            
            if (selected.includes(hovered)) {
                this.isMoving = true;
                this.moveItems();
                return true;
            }
        }

        this.isDragStart = false;

        return false;
    }

    up() {
        super.up();
        this.isDragStart = true;
        this.isMoving = false;
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
        return true;
    }

    leave() {
        this.isDragStart = true;
        this.isMoving = false;
    }

    private moveItems() {
        const selectedItems = this.controller.viewStore.getSelectedViews();
        const mouseDelta = this.controller.pointer.pointer.getDownDiff();

        selectedItems.forEach((item, index) => item.dimensions = this.origDimensions[index].translate(mouseDelta));

        this.controller.renderWindow();
    }
}