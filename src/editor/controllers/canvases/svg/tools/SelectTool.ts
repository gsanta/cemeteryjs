import { SvgCanvasController } from "../SvgCanvasController";
import { AbstractSelectionTool } from "./AbstractSelectionTool";
import { ToolType } from "./Tool";
import { CanvasItemTag } from "../models/CanvasItem";
import { maxBy } from '../../../../../model/geometry/utils/Functions';
import { EditorFacade } from "../../../EditorFacade";

export class SelectTool extends AbstractSelectionTool {

    constructor(services: EditorFacade) {
        super(services, ToolType.SELECT, true);
    }

    down() {
        super.down();
        this.services.svgCanvasController.renderCanvas();
    }

    drag() {
        super.drag();
        this.services.svgCanvasController.renderCanvas();
    }

    click() {
        super.click();

        const viewStore = this.services.viewStore;

        viewStore.removeTag(viewStore.getViews(), CanvasItemTag.SELECTED);

        const hoveredView = viewStore.getHoveredView()

        hoveredView && viewStore.addTag([hoveredView], CanvasItemTag.SELECTED);

        this.services.svgCanvasController.renderCanvas();
        this.services.svgCanvasController.renderToolbar();
    }

    draggedUp() {
        super.draggedUp();
        const canvasItems = this.services.viewStore.getIntersectingItemsInRect(this.getSelectionRect());
        const canvasStore = this.services.viewStore;
        
        canvasStore.removeTag(this.services.viewStore.getViews(), CanvasItemTag.SELECTED);
        canvasStore.addTag(canvasItems, CanvasItemTag.SELECTED);

        this.services.svgCanvasController.renderCanvas();
        this.services.svgCanvasController.renderToolbar();
    }
}