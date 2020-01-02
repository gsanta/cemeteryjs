import { EventDispatcher } from '../../../events/EventDispatcher';
import { SvgCanvasController } from '../SvgCanvasController';
import { ToolType } from './Tool';
import { Rectangle } from '../../../../../model/geometry/shapes/Rectangle';
import { Point } from '../../../../../model/geometry/shapes/Point';
import { WorldItemShape } from '../../../../../world_generator/services/GameObject';
import { Events } from '../../../events/Events';
import { AbstractSelectionTool } from './AbstractSelectionTool';
import { CanvasItem } from '../models/CanvasItem';

export class RectangleTool extends AbstractSelectionTool {
    private eventDispatcher: EventDispatcher;
    private lastPreviewRect: CanvasItem;

    constructor(svgCanvasController: SvgCanvasController, eventDispatcher: EventDispatcher) {
        super(svgCanvasController, ToolType.RECTANGLE, false);

        this.canvasController = svgCanvasController;
        this.eventDispatcher = eventDispatcher;
    }

    down() {
        super.down();
        this.canvasController.renderCanvas();
    }

    click() {
        const point = this.canvasController.mouseController.downPoint;
        const pixelSize = this.canvasController.configModel.pixelSize;
        const rectSize = new Point(10, 10).mul(pixelSize);
        const topLeft = new Point(point.x - rectSize.x / 2, point.y - rectSize.y / 2).div(pixelSize);
        const bottomRight = new Point(point.x + rectSize.x / 2, point.y + rectSize.y / 2).div(pixelSize);
        const rect = new Rectangle(topLeft, bottomRight);
        const type = this.canvasController.selectedWorldItemDefinition.typeName;

        const canvasItem: CanvasItem = {
            color: 'grey',
            dimensions: rect,
            type: type,
            layer: 0,
            isPreview: false,
            tags: new Set(),
            shape: WorldItemShape.RECTANGLE,
            model: null,
            rotation: 0,
            scale: 1
        }

        this.canvasController.pixelModel.addRect(canvasItem);
    
        this.canvasController.renderCanvas();
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }

    drag() {
        super.drag();
        
        if (this.lastPreviewRect) {
            this.canvasController.pixelModel.removeRectangle(this.lastPreviewRect);
        }
        const type = this.canvasController.selectedWorldItemDefinition.typeName;
        const positions = this.getPositionsInSelection();

        if (positions.length > 0) {
            this.lastPreviewRect = this.canvasController.pixelModel.addRectangle(positions, type, 0, true);
    
            this.canvasController.renderCanvas();
        }
    }

    draggedUp() {
        super.draggedUp();
        if (this.lastPreviewRect) {
            this.lastPreviewRect.isPreview = false;
            this.lastPreviewRect = null;
        }

        this.canvasController.renderCanvas();
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
}