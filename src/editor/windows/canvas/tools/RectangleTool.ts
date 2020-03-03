import { Rectangle } from '../../../../misc/geometry/shapes/Rectangle';
import { UpdateTask } from '../../../common/services/UpdateServices';
import { CanvasWindow } from '../CanvasWindow';
import { AbstractTool } from './AbstractTool';
import { RectangleSelector } from './selection/RectangleSelector';
import { ToolType } from './Tool';
import { MeshView } from '../models/views/MeshView';
import { ViewType } from '../models/views/View';
import { CanvasItemTag } from '../models/CanvasItem';
import { ServiceLocator } from '../../../ServiceLocator';

export class RectangleTool extends AbstractTool {
    private lastPreviewRect: MeshView;
    private rectSelector: RectangleSelector;
    private controller: CanvasWindow;
    private services: ServiceLocator;

    constructor(controller: CanvasWindow, services: ServiceLocator) {
        super(ToolType.RECTANGLE);

        this.controller = controller;
        this.services = services;
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

        gameObject.name = this.controller.stores.viewStore.generateUniqueName(ViewType.GameObject);

        this.controller.stores.viewStore.addRect(gameObject);
        this.controller.stores.viewStore.removeSelectionAll()
        this.controller.stores.viewStore.addTag([gameObject], CanvasItemTag.SELECTED);

        this.services.levelService().updateLevel();
        this.controller.updateService.scheduleTasks(UpdateTask.All);
    }

    drag() {
        super.drag()
        if (this.lastPreviewRect) {
            this.controller.stores.viewStore.remove(this.lastPreviewRect);
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
        gameObject.name = this.controller.stores.viewStore.generateUniqueName(ViewType.GameObject);

        if (positions.length > 0) {
            this.lastPreviewRect = this.controller.stores.viewStore.addRect(gameObject);
    
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