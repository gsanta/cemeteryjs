import { EventDispatcher } from "../../../events/EventDispatcher";
import { CanvasItem, PixelTag } from '../models/GridCanvasStore';
import { SvgCanvasController } from "../SvgCanvasController";
import { AbstractTool } from './AbstractTool';
import { ToolType } from './Tool';
import { Polygon } from "../../../../../geometry/shapes/Polygon";
import { Events } from '../../../events/Events';

export class MoveTool extends AbstractTool {
    private eventDispatcher: EventDispatcher;
    private lastPreviewRect: CanvasItem;
    private canvasController: SvgCanvasController;

    private origDimensions: Polygon[] = [];

    constructor(svgCanvasController: SvgCanvasController, eventDispatcher: EventDispatcher) {
        super(ToolType.MOVE);
        this.eventDispatcher = eventDispatcher;
        this.canvasController = svgCanvasController;
    }

    down() {
        super.down();
        this.canvasController.renderCanvas();

        const selectedItems = PixelTag.getSelectedItems(this.canvasController.pixelModel.items);
        this.origDimensions = selectedItems.map(item => item.polygon);
    }

    drag() {
        super.drag();
        
        const mouseController = this.canvasController.mouseController;
    
        const selectedItems = PixelTag.getSelectedItems(this.canvasController.pixelModel.items);
        const mouseDelta = mouseController.movePoint.subtract(mouseController.downPoint);
        mouseDelta.x = Math.floor(mouseDelta.x / this.canvasController.configModel.pixelSize);
        mouseDelta.y = Math.floor(mouseDelta.y / this.canvasController.configModel.pixelSize);

        selectedItems.forEach((item, index) => item.polygon = this.origDimensions[index].translate(mouseDelta));

        this.canvasController.renderCanvas();
    }

    up() {
        super.up();
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
}