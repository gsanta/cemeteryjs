import { Rectangle } from '../../../../misc/geometry/shapes/Rectangle';
import { ServiceLocator } from '../../../services/ServiceLocator';
import { UpdateTask } from '../../../services/UpdateServices';
import { Stores } from '../../../stores/Stores';
import { CanvasView } from '../CanvasView';
import { MeshConcept } from '../models/concepts/MeshConcept';
import { AbstractTool } from './AbstractTool';
import { RectangleSelector } from './selection/RectangleSelector';
import { ToolType } from './Tool';
import { ConceptType } from '../models/concepts/Concept';

export class RectangleTool extends AbstractTool {
    private lastPreviewRect: MeshConcept;
    private rectSelector: RectangleSelector;
    private controller: CanvasView;
    
    constructor(controller: CanvasView, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(ToolType.RECTANGLE, getServices, getStores);

        this.controller = controller;
        this.getServices = getServices;
        this.getStores = getStores;
        this.rectSelector = new RectangleSelector(controller);
    }

    click() {
        const pointer = this.getServices().pointerService().pointer;
        const rect = Rectangle.squareFromCenterPointAndRadius(pointer.down, 50);

        const meshConcept: MeshConcept = new MeshConcept(null, rect, name);
        meshConcept.rotation = 0;
        meshConcept.scale = 1;
        meshConcept.color = 'grey';

        meshConcept.id = this.getStores().canvasStore.generateUniqueName(ConceptType.MeshConcept);

        this.getStores().canvasStore.addConcept(meshConcept);
        this.getStores().selectionStore.clear()
        this.getStores().selectionStore.addItem(meshConcept);

        this.getServices().levelService().updateCurrentLevel();
        this.getServices().gameService().addConcept(meshConcept);
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

        const meshConcept: MeshConcept = new MeshConcept(null, dimensions, name);
        meshConcept.rotation = 0;
        meshConcept.scale = 1;
        meshConcept.color = 'grey';
        meshConcept.id = this.getStores().canvasStore.generateUniqueName(ConceptType.MeshConcept);

        if (positions.length > 0) {
            this.getStores().canvasStore.addConcept(meshConcept);
            this.lastPreviewRect = meshConcept;
    
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
        }
    }

    draggedUp() {
        super.draggedUp();

        this.rectSelector.finish();
        this.getServices().gameService().addConcept(this.lastPreviewRect);
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