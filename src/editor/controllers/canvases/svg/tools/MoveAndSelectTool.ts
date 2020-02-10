import { CanvasController } from "../CanvasController";
import { ToolType, Tool } from "./Tool";
import { MoveTool } from './MoveTool';
import { SelectTool } from "./SelectTool";
import { EventDispatcher } from '../../../events/EventDispatcher';
import { AbstractTool } from './AbstractTool';
import { Rectangle } from "../../../../../misc/geometry/shapes/Rectangle";
import { CanvasItemTag } from "../models/CanvasItem";
import { EditorFacade } from "../../../EditorFacade";

export class MoveAndSelectTool extends AbstractTool {

    private activeTool: Tool;
    private moveTool: MoveTool;
    private rectSelectTool: SelectTool;
    private controller: CanvasController;

    constructor(controller: CanvasController, eventDispatcher: EventDispatcher) {
        super(ToolType.MOVE_AND_SELECT);
        this.controller = controller;
        this.moveTool = new MoveTool(this.controller, eventDispatcher);
        this.rectSelectTool = new SelectTool(this.controller);

        this.activeTool = this.rectSelectTool;
    }

    supportsRectSelection(): boolean { return true; }

    displaySelectionRect(): boolean {
        switch(this.activeTool.type) {
            case ToolType.MOVE:
                return false;
            case ToolType.SELECT:
                return true;
        }
    }

    getSelectionRect(): Rectangle {
        return this.rectSelectTool.getSelectionRect();
    }

    down() {
        super.down();

        this.determineActiveTool();
        this.activeTool.down();
    }

    click() {
        super.click();

        this.determineActiveTool();
        this.activeTool.click();
    }

    drag() {
        super.drag();

        this.activeTool.drag();
    }

    up() {
        this.determineActiveTool();
        super.up();
        this.activeTool.up();
    }

    draggedUp() {
        super.draggedUp();

        this.determineActiveTool();
        this.activeTool.draggedUp();
    }

    private determineActiveTool() {
        if (this.activeTool.type === ToolType.MOVE) {
            if (this.controller.mouseController.isDrag) {
                return;
            }
        }

        const canvasStore = this.controller.viewStore;

        const hoveredItem = canvasStore.getHoveredView();
        const selectedItems = canvasStore.getSelectedViews();
        if (hoveredItem && selectedItems.includes(hoveredItem)) {
            this.activeTool = this.moveTool;
        } else {
            this.activeTool = this.rectSelectTool;
        }
    }
}