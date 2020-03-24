import { Rectangle } from '../../../../misc/geometry/shapes/Rectangle';
import { UpdateTask } from '../../../services/UpdateServices';
import { CanvasView, CanvasTag } from '../CanvasView';
import { AbstractTool } from './AbstractTool';
import { RectangleSelector } from './selection/RectangleSelector';
import { ToolType } from './Tool';
import { MeshConcept } from '../models/concepts/MeshConcept';
import { ServiceLocator } from '../../../services/ServiceLocator';
import { Stores } from '../../../stores/Stores';
import { CanvasItemType } from '../models/CanvasItem';

export class RectangleTool extends AbstractTool {
    private lastPreviewRect: MeshConcept;
    private rectSelector: RectangleSelector;
    private controller: CanvasView;
    private getServices: () => ServiceLocator;
    private getStores: () => Stores;
    
    constructor(controller: CanvasView, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(ToolType.RECTANGLE);

        this.controller = controller;
        this.getServices = getServices;
        this.getStores = getStores;
        this.rectSelector = new RectangleSelector(controller);
    }

    click() {
        const pointer = this.getServices().pointerService().pointer;
        const rect = Rectangle.squareFromCenterPointAndRadius(pointer.down, 50);

        const gameObject: MeshConcept = new MeshConcept(null, rect, name);
        gameObject.rotation = 0;
        gameObject.modelPath = null;
        gameObject.texturePath = null;
        gameObject.scale = 1;
        gameObject.color = 'grey';

        gameObject.name = this.getStores().canvasStore.generateUniqueName(CanvasItemType.MeshConcept);

        this.getStores().canvasStore.addConcept(gameObject);
        this.getStores().selectionStore.clear()
        this.getStores().selectionStore.addItem(gameObject);

        this.getServices().levelService().updateCurrentLevel();
        this.getServices().updateService().scheduleTasks(UpdateTask.All, UpdateTask.SaveData);
    }

    drag() {
        super.drag()
        if (this.lastPreviewRect) {
            this.getStores().canvasStore.removeConcept(this.lastPreviewRect);
        }
        this.rectSelector.updateRect(this.getServices().pointerService().pointer);
        this.controller.feedbackStore.rectSelectFeedback.isVisible = false;
        const positions = this.rectSelector.getPositionsInSelection();

        const dimensions = this.controller.feedbackStore.rectSelectFeedback.rect;

        const gameObject: MeshConcept = new MeshConcept(null, dimensions, name);
        gameObject.rotation = 0;
        gameObject.modelPath = null;
        gameObject.texturePath = null;
        gameObject.scale = 1;
        gameObject.color = 'grey';
        gameObject.name = this.getStores().canvasStore.generateUniqueName(CanvasItemType.MeshConcept);

        if (positions.length > 0) {
            this.getStores().canvasStore.addConcept(gameObject);
            this.lastPreviewRect = gameObject;
    
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
        }
    }

    draggedUp() {
        super.draggedUp();

        this.rectSelector.finish();
        if (this.lastPreviewRect) {
            this.lastPreviewRect = null;
        }

        this.getServices().updateService().scheduleTasks(UpdateTask.All, UpdateTask.SaveData);
    }

    leave() {
        this.rectSelector.finish();
        return true;
    }
}