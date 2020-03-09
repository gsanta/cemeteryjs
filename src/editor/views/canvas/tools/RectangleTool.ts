import { Rectangle } from '../../../../misc/geometry/shapes/Rectangle';
import { UpdateTask } from '../../../services/UpdateServices';
import { CanvasView } from '../CanvasView';
import { AbstractTool } from './AbstractTool';
import { RectangleSelector } from './selection/RectangleSelector';
import { ToolType } from './Tool';
import { MeshConcept } from '../models/concepts/MeshConcept';
import { ConceptType } from '../models/concepts/Concept';
import { CanvasItemTag } from '../models/CanvasItem';
import { ServiceLocator } from '../../../services/ServiceLocator';
import { Stores } from '../../../stores/Stores';

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
        const pointer = this.controller.pointer.pointer;
        const rect = Rectangle.squareFromCenterPointAndRadius(pointer.down, 50);

        const gameObject: MeshConcept = new MeshConcept(null, rect, name);
        gameObject.type = 'rect';
        gameObject.rotation = 0;
        gameObject.modelPath = null;
        gameObject.texturePath = null;
        gameObject.scale = 1;
        gameObject.color = 'grey';

        gameObject.name = this.getStores().conceptStore.generateUniqueName(ConceptType.Mesh);

        this.getStores().conceptStore.addRect(gameObject);
        this.getStores().conceptStore.removeSelectionAll()
        this.getStores().conceptStore.addTag([gameObject], CanvasItemTag.SELECTED);

        this.getServices().levelService().updateCurrentLevel();
        this.getServices().updateService().scheduleTasks(UpdateTask.All);
    }

    drag() {
        super.drag()
        if (this.lastPreviewRect) {
            this.getStores().conceptStore.remove(this.lastPreviewRect);
        }
        this.rectSelector.updateRect(this.controller.pointer.pointer);
        this.controller.feedbackStore.rectSelectFeedback.isVisible = false;
        const positions = this.rectSelector.getPositionsInSelection();

        const dimensions = this.controller.feedbackStore.rectSelectFeedback.rect;

        const gameObject: MeshConcept = new MeshConcept(null, dimensions, name);
        gameObject.type = 'rect'
        gameObject.rotation = 0;
        gameObject.modelPath = null;
        gameObject.texturePath = null;
        gameObject.scale = 1;
        gameObject.color = 'grey';
        gameObject.name = this.getStores().conceptStore.generateUniqueName(ConceptType.Mesh);

        if (positions.length > 0) {
            this.lastPreviewRect = this.getStores().conceptStore.addRect(gameObject);
    
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