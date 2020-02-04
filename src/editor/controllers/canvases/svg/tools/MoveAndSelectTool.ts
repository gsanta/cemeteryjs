import { SvgCanvasController } from "../SvgCanvasController";
import { ToolType, Tool } from "./Tool";
import { MoveTool } from './MoveTool';
import { SelectTool } from "./SelectTool";
import { EventDispatcher } from '../../../events/EventDispatcher';
import { AbstractTool } from './AbstractTool';
import { Rectangle } from "../../../../../model/geometry/shapes/Rectangle";
import { CanvasItemTag } from "../models/CanvasItem";
import { EditorFacade } from "../../../EditorFacade";

export class MoveAndSelectTool extends AbstractTool {

    private activeTool: Tool;
    private moveTool: MoveTool;
    private rectSelectTool: SelectTool;
    private services: EditorFacade;

    constructor(services: EditorFacade, eventDispatcher: EventDispatcher) {
        super(ToolType.MOVE_AND_SELECT);
        this.services = services;
        this.moveTool = new MoveTool(this.services, eventDispatcher);
        this.rectSelectTool = new SelectTool(this.services);

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
            if (this.services.svgCanvasController.mouseController.isDrag) {
                return;
            }
        }

        const canvasStore = this.services.viewStore;

        const hoveredItem = canvasStore.getHoveredView();
        const selectedItems = canvasStore.getSelectedViews();
        if (hoveredItem && selectedItems.includes(hoveredItem)) {
            this.activeTool = this.moveTool;
        } else {
            this.activeTool = this.rectSelectTool;
        }
    }
}