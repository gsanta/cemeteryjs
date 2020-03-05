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
import { Stores } from '../../../Stores';

export class RectangleTool extends AbstractTool {
    private lastPreviewRect: MeshView;
    private rectSelector: RectangleSelector;
    private controller: CanvasWindow;
    private getServices: () => ServiceLocator;
    private getStores: () => Stores;
    
    constructor(controller: CanvasWindow, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(ToolType.RECTANGLE);

        this.controller = controller;
        this.getServices = getServices;
        this.getStores = getStores;
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

        gameObject.name = this.getStores().viewStore.generateUniqueName(ViewType.GameObject);

        this.getStores().viewStore.addRect(gameObject);
        this.getStores().viewStore.removeSelectionAll()
        this.getStores().viewStore.addTag([gameObject], CanvasItemTag.SELECTED);

        this.getServices().levelService().updateCurrentLevel();
        this.getServices().updateService().scheduleTasks(UpdateTask.All);
    }

    drag() {
        super.drag()
        if (this.lastPreviewRect) {
            this.getStores().viewStore.remove(this.lastPreviewRect);
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
        gameObject.name = this.getStores().viewStore.generateUniqueName(ViewType.GameObject);

        if (positions.length > 0) {
            this.lastPreviewRect = this.getStores().viewStore.addRect(gameObject);
    
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
        }
    }

    draggedUp() {
        super.draggedUp();

        this.rectSelector.finish();
        if (this.lastPreviewRect) {
            this.lastPreviewRect = null;
        }

        this.getServices().updateService().scheduleTasks(UpdateTask.All);
    }

    leave() {
        this.rectSelector.finish();
        return true;
    }
}