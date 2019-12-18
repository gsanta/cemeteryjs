import { AbstractSelectionTool } from "./AbstractSelectionTool";
import { SvgCanvasController } from "../SvgCanvasController";
import { ToolType, Tool } from "./Tool";
import { PixelTag } from "../models/GridCanvasStore";
import { MoveTool } from './MoveTool';
import { SelectTool } from "./SelectTool";
import { EventDispatcher } from '../../../events/EventDispatcher';
import { AbstractTool } from './AbstractTool';

export class MoveAndSelectTool extends AbstractTool {

    private activeTool: Tool;
    private moveTool: MoveTool;
    private rectSelectTool: SelectTool;
    private canvasController: SvgCanvasController;

    constructor(canvasController: SvgCanvasController, eventDispatcher: EventDispatcher) {
        super(ToolType.MOVE_AND_SELECT);
        this.canvasController = canvasController;
        this.moveTool = new MoveTool(canvasController, eventDispatcher);
        this.rectSelectTool = new SelectTool(canvasController);

        this.activeTool = this.rectSelectTool;
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

        this.determineActiveTool();
        this.activeTool.drag();
    }

    private determineActiveTool() {
        if (this.activeTool.type === ToolType.MOVE) {
            if (this.canvasController.mouseController.isDrag) {
                return;
            }
        }

        const hoveredItem = PixelTag.getHoveredItem(this.canvasController.pixelModel.items);
        const selectedItems = PixelTag.getSelectedItems(this.canvasController.pixelModel.items);
        if (hoveredItem && selectedItems.includes(hoveredItem)) {
            this.activeTool = this.moveTool;
        } else {
            this.activeTool = this.rectSelectTool;
        }
    }
}