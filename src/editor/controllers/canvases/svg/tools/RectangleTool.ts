import { EventDispatcher } from '../../../events/EventDispatcher';
import { SvgCanvasController } from '../SvgCanvasController';
import { ToolType } from './Tool';
import { CanvasItem } from '../models/SvgCanvasStore';
import { Rectangle } from '../../../../../model/geometry/shapes/Rectangle';
import { Point } from '../../../../../model/geometry/shapes/Point';
import { WorldItemShape } from '../../../../../world_generator/services/GameObject';
import { AbstractTool } from './AbstractTool';
import { Events } from '../../../events/Events';

export class RectangleTool extends AbstractTool {
    private canvasController: SvgCanvasController;
    private eventDispatcher: EventDispatcher;

    constructor(svgCanvasController: SvgCanvasController, eventDispatcher: EventDispatcher) {
        super(ToolType.RECTANGLE);

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
            rotation: 0
        }

        this.canvasController.pixelModel.addRect(canvasItem);
    
        this.canvasController.renderCanvas();
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
}