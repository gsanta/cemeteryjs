import { EventDispatcher } from "../../../events/EventDispatcher";
import { SvgCanvasController } from "../SvgCanvasController";
import { AbstractTool } from './AbstractTool';
import { ToolType } from './Tool';
import { Events } from '../../../events/Events';
import { Rectangle } from "../../../../../model/geometry/shapes/Rectangle";
import { CanvasItemTag } from "../models/CanvasItem";

export class MoveTool extends AbstractTool {
    private eventDispatcher: EventDispatcher;
    private canvasController: SvgCanvasController;

    private origDimensions: Rectangle[] = [];

    constructor(svgCanvasController: SvgCanvasController, eventDispatcher: EventDispatcher) {
        super(ToolType.MOVE);
        this.eventDispatcher = eventDispatcher;
        this.canvasController = svgCanvasController;
    }

    down() {
        super.down();

        const canvasStore = this.canvasController.canvasStore;

        const selectedItems = canvasStore.getSelectedViews();
        this.origDimensions = selectedItems.map(item => item.dimensions);
    }

    drag() {
        super.drag();
        const canvasStore = this.canvasController.canvasStore;
        
        const mouseController = this.canvasController.mouseController;
    
        const selectedItems = canvasStore.getSelectedViews();
        const mouseDelta = mouseController.pointer.getDownDiff();
        mouseDelta.x = Math.floor(mouseDelta.x / this.canvasController.configModel.pixelSize);
        mouseDelta.y = Math.floor(mouseDelta.y / this.canvasController.configModel.pixelSize);

        selectedItems.forEach((item, index) => item.dimensions = this.origDimensions[index].translate(mouseDelta));

        this.canvasController.renderCanvas();
    }

    up() {
        super.up();
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
}