import { AbstractSelectionTool } from "./AbstractSelectionTool";
import { EventDispatcher } from "../../../events/EventDispatcher";
import { CanvasItem, PixelTag } from '../models/GridCanvasStore';
import { SvgCanvasController } from "../SvgCanvasController";
import { ToolType } from "./Tool";

export class MoveTool extends AbstractSelectionTool {
    private eventDispatcher: EventDispatcher;
    private lastPreviewRect: CanvasItem;

    constructor(svgCanvasController: SvgCanvasController, eventDispatcher: EventDispatcher) {
        super(svgCanvasController, ToolType.MOVE, false);
        this.eventDispatcher = eventDispatcher;
    }

    down() {
        super.down();
        this.canvasController.renderCanvas();
    }

    drag() {
        super.drag();
        // console.log(mouseDelta)

        const mouseController = this.canvasController.mouseController;

        const selectedItems = PixelTag.getSelectedItems(this.canvasController.pixelModel.items);
        const mouseDelta = mouseController.movePoint.subtract(mouseController.downPoint);
        selectedItems.forEach(item => item.polygon.translate(mouseDelta));

        this.canvasController.renderCanvas();
    }
}