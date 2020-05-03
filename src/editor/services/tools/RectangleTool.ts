import { Rectangle } from '../../../misc/geometry/shapes/Rectangle';
import { Registry } from '../../Registry';
import { ConceptType } from '../../views/canvas/models/concepts/Concept';
import { MeshConcept } from '../../views/canvas/models/concepts/MeshConcept';
import { UpdateTask } from '../UpdateServices';
import { AbstractTool } from './AbstractTool';
import { RectangleSelector } from './RectangleSelector';
import { ToolType } from './Tool';

export class RectangleTool extends AbstractTool {
    private lastPreviewRect: MeshConcept;
    private rectSelector: RectangleSelector;

    constructor(registry: Registry) {
        super(ToolType.RECTANGLE, registry);

        this.rectSelector = new RectangleSelector(registry);
    }

    click() {
        const pointer = this.registry.services.pointer.pointer;
        const rect = Rectangle.squareFromCenterPointAndRadius(pointer.down, 50);

        const meshConcept: MeshConcept = new MeshConcept(rect, name);
        meshConcept.rotation = 0;
        meshConcept.scale = 1;
        meshConcept.color = 'grey';

        meshConcept.id = this.registry.stores.canvasStore.generateUniqueName(ConceptType.MeshConcept);

        this.registry.stores.canvasStore.addConcept(meshConcept);
        this.registry.stores.selectionStore.clear()
        this.registry.stores.selectionStore.addItem(meshConcept);

        this.registry.services.level.updateCurrentLevel();
        this.registry.services.game.addConcept(meshConcept);
        this.registry.services.update.scheduleTasks(UpdateTask.All, UpdateTask.SaveData);
    }

    drag() {
        super.drag()
        if (this.lastPreviewRect) {
            this.registry.stores.canvasStore.removeConcept(this.lastPreviewRect);
        }
        this.rectSelector.updateRect(this.registry.services.pointer.pointer);
        this.registry.stores.feedback.rectSelectFeedback.isVisible = false;
        const positions = this.rectSelector.getPositionsInSelection();

        const dimensions = this.registry.stores.feedback.rectSelectFeedback.rect;

        const meshConcept: MeshConcept = new MeshConcept(dimensions, name);
        meshConcept.rotation = 0;
        meshConcept.scale = 1;
        meshConcept.color = 'grey';
        meshConcept.id = this.registry.stores.canvasStore.generateUniqueName(ConceptType.MeshConcept);

        if (positions.length > 0) {
            this.registry.stores.canvasStore.addConcept(meshConcept);
            this.lastPreviewRect = meshConcept;
    
            this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
        }
    }

    draggedUp() {
        super.draggedUp();

        this.rectSelector.finish();
        this.registry.services.game.addConcept(this.lastPreviewRect);
        if (this.lastPreviewRect) {
            this.lastPreviewRect = null;
        }

        this.registry.services.update.scheduleTasks(UpdateTask.All, UpdateTask.SaveData);
    }

    leave() {
        this.rectSelector.finish();
        return true;
    }
}