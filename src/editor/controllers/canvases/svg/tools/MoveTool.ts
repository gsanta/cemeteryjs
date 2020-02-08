import { EventDispatcher } from "../../../events/EventDispatcher";
import { SvgCanvasController } from "../SvgCanvasController";
import { AbstractTool } from './AbstractTool';
import { ToolType } from './Tool';
import { Events } from '../../../events/Events';
import { Rectangle } from "../../../../../misc/geometry/shapes/Rectangle";
import { CanvasItemTag } from "../models/CanvasItem";
import { EditorFacade } from "../../../EditorFacade";

export class MoveTool extends AbstractTool {
    private eventDispatcher: EventDispatcher;
    private services: EditorFacade;

    private origDimensions: Rectangle[] = [];

    constructor(services: EditorFacade, eventDispatcher: EventDispatcher) {
        super(ToolType.MOVE);
        this.eventDispatcher = eventDispatcher;
        this.services = services;
    }

    down() {
        super.down();

        const canvasStore = this.services.viewStore;

        const selectedItems = canvasStore.getSelectedViews();
        this.origDimensions = selectedItems.map(item => item.dimensions);
    }

    drag() {
        super.drag();
        const canvasStore = this.services.viewStore;
        
        const mouseController = this.services.svgCanvasController.mouseController;
    
        const selectedItems = canvasStore.getSelectedViews();
        const mouseDelta = mouseController.pointer.getDownDiff();

        selectedItems.forEach((item, index) => item.dimensions = this.origDimensions[index].translate(mouseDelta));

        this.services.svgCanvasController.renderCanvas();
    }

    up() {
        super.up();
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
}