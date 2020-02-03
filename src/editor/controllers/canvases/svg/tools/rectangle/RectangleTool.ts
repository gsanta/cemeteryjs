import { Rectangle } from '../../../../../../model/geometry/shapes/Rectangle';
import { WorldItemShape, GameObject } from '../../../../../../world_generator/services/GameObject';
import { EventDispatcher } from '../../../../events/EventDispatcher';
import { Events } from '../../../../events/Events';
import { SvgCanvasController } from '../../SvgCanvasController';
import { AbstractSelectionTool } from '../AbstractSelectionTool';
import { ToolType } from '../Tool';
import { CanvasItemTag } from '../../models/CanvasItem';

export class RectangleTool extends AbstractSelectionTool {
    private eventDispatcher: EventDispatcher;
    private lastPreviewRect: GameObject;

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
        const pointer = this.canvasController.mouseController.pointer;
        const pixelSize = this.canvasController.configModel.pixelSize;
        const rect = Rectangle.squareFromCenterPointAndRadius(pointer.down, 5 * pixelSize).div(pixelSize);

        const type = this.canvasController.selectedWorldItemDefinition.typeName;

        const gameObject: GameObject = new GameObject(null, rect, name);
        gameObject.type = type;
        gameObject.rotation = 0;
        gameObject.modelPath = null;
        gameObject.texturePath = null;
        gameObject.scale = 1;
        gameObject.color = 'grey';

        this.canvasController.canvasStore.addRect(gameObject);
        this.canvasController.canvasStore.removeSelectionAll()
        this.canvasController.canvasStore.addTag([gameObject], CanvasItemTag.SELECTED);
    
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
        this.canvasController.renderCanvas();
        this.canvasController.renderToolbar();
    }

    drag() {
        super.drag();
        
        if (this.lastPreviewRect) {
            this.canvasController.canvasStore.remove(this.lastPreviewRect);
        }
        const type = this.canvasController.selectedWorldItemDefinition.typeName;
        const positions = this.getPositionsInSelection();

        const pixelSize = this.canvasController.configModel.pixelSize;
        const dimensions = this.getSelectionRect().div(pixelSize);

        const gameObject: GameObject = new GameObject(null, dimensions, name);
        gameObject.type = type;
        gameObject.rotation = 0;
        gameObject.modelPath = null;
        gameObject.texturePath = null;
        gameObject.scale = 1;
        gameObject.color = 'grey';

        if (positions.length > 0) {
            this.lastPreviewRect = this.canvasController.canvasStore.addRect(gameObject);
    
            this.canvasController.renderCanvas();
        }
    }

    draggedUp() {
        super.draggedUp();
        if (this.lastPreviewRect) {
            this.lastPreviewRect = null;
        }

        this.canvasController.renderCanvas();
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
}