import { MeshView } from '../../../../../../common/views/MeshView';
import { ViewType } from '../../../../../../common/views/View';
import { Rectangle } from '../../../../../../misc/geometry/shapes/Rectangle';
import { EventDispatcher } from '../../../../events/EventDispatcher';
import { Events } from '../../../../events/Events';
import { CanvasController } from '../../CanvasController';
import { CanvasItemTag } from '../../models/CanvasItem';
import { AbstractSelectionTool } from '../AbstractSelectionTool';
import { ToolType } from '../Tool';

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
        const pointer = this.services.pointer.pointer;
        const rect = Rectangle.squareFromCenterPointAndRadius(pointer.down, 50);

        const gameObject: MeshView = new MeshView(null, rect, name);
        gameObject.type = 'rect';
        gameObject.rotation = 0;
        gameObject.modelPath = null;
        gameObject.texturePath = null;
        gameObject.scale = 1;
        gameObject.color = 'grey';

        gameObject.name = this.services.nameingService.generateName(ViewType.GameObject);

        this.services.viewStore.addRect(gameObject);
        this.services.viewStore.removeSelectionAll()
        this.services.viewStore.addTag([gameObject], CanvasItemTag.SELECTED);

        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
        this.services.renderToolbar();
        return true;
    }

    drag() {
        super.drag();
        
        if (this.lastPreviewRect) {
            this.services.viewStore.remove(this.lastPreviewRect);
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
        gameObject.name = this.services.nameingService.generateName(ViewType.GameObject);

        if (positions.length > 0) {
            this.lastPreviewRect = this.services.viewStore.addRect(gameObject);
    
            this.services.renderWindow();
        }
    }

    draggedUp() {
        super.draggedUp();
        if (this.lastPreviewRect) {
            this.lastPreviewRect = null;
        }

        this.services.renderWindow();
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
}