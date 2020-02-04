import { Rectangle } from '../../../../../../model/geometry/shapes/Rectangle';
import { WorldItemShape, GameObject } from '../../../../../../world_generator/services/GameObject';
import { EventDispatcher } from '../../../../events/EventDispatcher';
import { Events } from '../../../../events/Events';
import { SvgCanvasController } from '../../SvgCanvasController';
import { AbstractSelectionTool } from '../AbstractSelectionTool';
import { ToolType } from '../Tool';
import { CanvasItemTag } from '../../models/CanvasItem';
import { EditorFacade } from '../../../../EditorFacade';

export class RectangleTool extends AbstractSelectionTool {
    private eventDispatcher: EventDispatcher;
    private lastPreviewRect: GameObject;

    constructor(editorFacade: EditorFacade, eventDispatcher: EventDispatcher) {
        super(editorFacade, ToolType.RECTANGLE, false);

        this.eventDispatcher = eventDispatcher;
    }

    down() {
        super.down();
        this.services.svgCanvasController.renderCanvas();
    }

    click() {
        const pointer = this.services.svgCanvasController.mouseController.pointer;
        const rect = Rectangle.squareFromCenterPointAndRadius(pointer.down, 50);

        const gameObject: GameObject = new GameObject(null, rect, name);
        gameObject.type = 'rect';
        gameObject.rotation = 0;
        gameObject.modelPath = null;
        gameObject.texturePath = null;
        gameObject.scale = 1;
        gameObject.color = 'grey';

        this.services.viewStore.addRect(gameObject);
        this.services.viewStore.removeSelectionAll()
        this.services.viewStore.addTag([gameObject], CanvasItemTag.SELECTED);
    
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
        this.services.svgCanvasController.renderCanvas();
        this.services.svgCanvasController.renderToolbar();
    }

    drag() {
        super.drag();
        
        if (this.lastPreviewRect) {
            this.services.viewStore.remove(this.lastPreviewRect);
        }
        const positions = this.getPositionsInSelection();

        const dimensions = this.getSelectionRect();

        const gameObject: GameObject = new GameObject(null, dimensions, name);
        gameObject.type = 'rect'
        gameObject.rotation = 0;
        gameObject.modelPath = null;
        gameObject.texturePath = null;
        gameObject.scale = 1;
        gameObject.color = 'grey';

        if (positions.length > 0) {
            this.lastPreviewRect = this.services.viewStore.addRect(gameObject);
    
            this.services.svgCanvasController.renderCanvas();
        }
    }

    draggedUp() {
        super.draggedUp();
        if (this.lastPreviewRect) {
            this.lastPreviewRect = null;
        }

        this.services.svgCanvasController.renderCanvas();
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
}