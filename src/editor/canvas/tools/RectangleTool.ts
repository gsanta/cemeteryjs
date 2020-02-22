import { MeshView } from '../models/views/MeshView';
import { ViewType } from '../models/views/View';
import { Rectangle } from '../../../misc/geometry/shapes/Rectangle';
import { EventDispatcher } from '../../common/EventDispatcher';
import { Events } from '../../common/Events';
import { CanvasController } from '../CanvasController';
import { CanvasItemTag } from '../models/CanvasItem';
import { AbstractSelectionTool } from './AbstractSelectionTool';
import { ToolType } from './Tool';

export class RectangleTool extends AbstractSelectionTool {
    private eventDispatcher: EventDispatcher;
    private lastPreviewRect: MeshView;

    constructor(services: CanvasController, eventDispatcher: EventDispatcher) {
        super(services, ToolType.RECTANGLE, false);

        this.eventDispatcher = eventDispatcher;
    }

    down() {
        return super.down();
    }

    click() {
        const pointer = this.controller.pointer.pointer;
        const rect = Rectangle.squareFromCenterPointAndRadius(pointer.down, 50);

        const gameObject: MeshView = new MeshView(null, rect, name);
        gameObject.type = 'rect';
        gameObject.rotation = 0;
        gameObject.modelPath = null;
        gameObject.texturePath = null;
        gameObject.scale = 1;
        gameObject.color = 'grey';

        gameObject.name = this.controller.nameingService.generateName(ViewType.GameObject);

        this.controller.viewStore.addRect(gameObject);
        this.controller.viewStore.removeSelectionAll()
        this.controller.viewStore.addTag([gameObject], CanvasItemTag.SELECTED);

        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
        this.controller.renderToolbar();
        return true;
    }

    drag() {
        super.drag();
        
        if (this.lastPreviewRect) {
            this.controller.viewStore.remove(this.lastPreviewRect);
        }
        const positions = this.getPositionsInSelection();

        const dimensions = this.getSelectionRect();

        const gameObject: MeshView = new MeshView(null, dimensions, name);
        gameObject.type = 'rect'
        gameObject.rotation = 0;
        gameObject.modelPath = null;
        gameObject.texturePath = null;
        gameObject.scale = 1;
        gameObject.color = 'grey';
        gameObject.name = this.controller.nameingService.generateName(ViewType.GameObject);

        if (positions.length > 0) {
            this.lastPreviewRect = this.controller.viewStore.addRect(gameObject);
    
            this.controller.renderWindow();
        }
    }

    draggedUp() {
        super.draggedUp();
        if (this.lastPreviewRect) {
            this.lastPreviewRect = null;
        }

        this.controller.renderWindow();
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
}