import { Rectangle } from '../../../misc/geometry/shapes/Rectangle';
import { Stores } from '../../stores/Stores';
import { ConceptType } from '../../views/canvas/models/concepts/Concept';
import { MeshConcept } from '../../views/canvas/models/concepts/MeshConcept';
import { ServiceLocator } from '../ServiceLocator';
import { UpdateTask } from '../UpdateServices';
import { AbstractTool } from './AbstractTool';
import { RectangleSelector } from './RectangleSelector';
import { ToolType } from './Tool';

export class RectangleTool extends AbstractTool {
    private lastPreviewRect: MeshConcept;
    private rectSelector: RectangleSelector;
    
    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        super(ToolType.RECTANGLE, getServices, getStores);

        this.getServices = getServices;
        this.getStores = getStores;
        this.rectSelector = new RectangleSelector(getStores);
    }

    click() {
        const pointer = this.getServices().pointer.pointer;
        const rect = Rectangle.squareFromCenterPointAndRadius(pointer.down, 50);

        const meshConcept: MeshConcept = new MeshConcept(null, rect, name);
        meshConcept.rotation = 0;
        meshConcept.scale = 1;
        meshConcept.color = 'grey';

        meshConcept.id = this.getStores().canvasStore.generateUniqueName(ConceptType.MeshConcept);

        this.getStores().canvasStore.addConcept(meshConcept);
        this.getStores().selectionStore.clear()
        this.getStores().selectionStore.addItem(meshConcept);

        this.getServices().level.updateCurrentLevel();
        this.getServices().game.addConcept(meshConcept);
        this.getServices().update.scheduleTasks(UpdateTask.All, UpdateTask.SaveData);
    }

    drag() {
        super.drag()
        if (this.lastPreviewRect) {
            this.getStores().canvasStore.removeConcept(this.lastPreviewRect);
        }
        this.rectSelector.updateRect(this.getServices().pointer.pointer);
        this.getStores().feedback.rectSelectFeedback.isVisible = false;
        const positions = this.rectSelector.getPositionsInSelection();

        const dimensions = this.getStores().feedback.rectSelectFeedback.rect;

        const meshConcept: MeshConcept = new MeshConcept(null, dimensions, name);
        meshConcept.rotation = 0;
        meshConcept.scale = 1;
        meshConcept.color = 'grey';
        meshConcept.id = this.getStores().canvasStore.generateUniqueName(ConceptType.MeshConcept);

        if (positions.length > 0) {
            this.getStores().canvasStore.addConcept(meshConcept);
            this.lastPreviewRect = meshConcept;
    
            this.getServices().update.scheduleTasks(UpdateTask.RepaintCanvas);
        }
    }

    draggedUp() {
        super.draggedUp();

        this.rectSelector.finish();
        this.getServices().game.addConcept(this.lastPreviewRect);
        if (this.lastPreviewRect) {
            this.lastPreviewRect = null;
        }

        this.getServices().update.scheduleTasks(UpdateTask.All, UpdateTask.SaveData);
    }

    leave() {
        this.rectSelector.finish();
        return true;
    }
}