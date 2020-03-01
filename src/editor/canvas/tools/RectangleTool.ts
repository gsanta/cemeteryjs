import { Rectangle } from '../../../misc/geometry/shapes/Rectangle';
import { EventDispatcher } from '../../common/EventDispatcher';
import { Events } from '../../common/Events';
import { CanvasController } from '../CanvasController';
import { CanvasItemTag } from '../models/CanvasItem';
import { MeshView } from '../models/views/MeshView';
import { ViewType } from '../models/views/View';
import { AbstractTool } from './AbstractTool';
import { ToolType } from './Tool';
import { RectangleSelector } from './selection/RectangleSelector';
import { UpdateTask } from '../../common/services/UpdateServices';
import { ServiceLocator } from '../../ServiceLocator';

export class RectangleTool extends AbstractTool {
    private lastPreviewRect: MeshView;
    private rectSelector: RectangleSelector;
    private controller: CanvasController;

    constructor(controller: CanvasController) {
        super(ToolType.RECTANGLE);

        this.controller = controller;
        this.rectSelector = new RectangleSelector(controller);
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

        gameObject.name = this.controller.viewStore.generateUniqueName(ViewType.GameObject);

        this.controller.viewStore.addRect(gameObject);
        this.controller.viewStore.removeSelectionAll()
        this.controller.viewStore.addTag([gameObject], CanvasItemTag.SELECTED);

        this.controller.updateService.scheduleTasks(UpdateTask.All);
    }

    drag() {
        super.drag()
        if (this.lastPreviewRect) {
            this.controller.viewStore.remove(this.lastPreviewRect);
        }
        this.rectSelector.updateRect(this.controller.pointer.pointer);
        this.controller.feedbackStore.rectSelectFeedback.isVisible = false;
        const positions = this.rectSelector.getPositionsInSelection();

        const dimensions = this.controller.feedbackStore.rectSelectFeedback.rect;

        const gameObject: MeshView = new MeshView(null, dimensions, name);
        gameObject.type = 'rect'
        gameObject.rotation = 0;
        gameObject.modelPath = null;
        gameObject.texturePath = null;
        gameObject.scale = 1;
        gameObject.color = 'grey';
        gameObject.name = this.controller.viewStore.generateUniqueName(ViewType.GameObject);

        if (positions.length > 0) {
            this.lastPreviewRect = this.controller.viewStore.addRect(gameObject);
    
            this.controller.updateService.scheduleTasks(UpdateTask.RepaintCanvas);
        }
    }

    draggedUp() {
        super.draggedUp();

        this.rectSelector.finish();
        if (this.lastPreviewRect) {
            this.lastPreviewRect = null;
        }

        this.controller.updateService.scheduleTasks(UpdateTask.All);
    }

    leave() {
        this.rectSelector.finish();
        return true;
    }
}