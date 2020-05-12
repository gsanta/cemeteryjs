import { VisualConcept } from '../../../core/models/concepts/VisualConcept';
import { Hoverable } from '../../../core/models/Hoverable';
import { Registry } from '../../../core/Registry';
import { UpdateTask } from '../../../core/services/UpdateServices';
import { isConcept, isControl } from '../../../core/stores/CanvasStore';
import { AbstractTool } from './AbstractTool';
import { RectangleSelector } from './RectangleSelector';
import { ToolType } from './Tool';

export class DeleteTool extends AbstractTool {
    private rectSelector: RectangleSelector;

    constructor(registry: Registry) {
        super(ToolType.Delete, registry);
        this.rectSelector = new RectangleSelector(registry);
    }

    drag() {
        this.rectSelector.updateRect(this.registry.services.pointer.pointer);
        this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    click() {
        this.registry.tools.pointer.click();
        const hoverStore = this.registry.stores.hoverStore;

        if (!hoverStore.hasAny()) { return; }

        if (isControl(hoverStore.getAny().type)) {
            hoverStore.getEditPoint().delete();
        } else if (isConcept(hoverStore.getAny().type)) {
            const concept = hoverStore.getConcept();
            this.registry.stores.canvasStore.removeConcept(concept);
            this.registry.services.game.deleteConcepts([concept]);
        }
        
        this.registry.services.level.updateCurrentLevel();
        hoverStore.hasAny() && this.registry.services.update.scheduleTasks(UpdateTask.All, UpdateTask.SaveData);
    }

    
    draggedUp() {
        const concepts = this.registry.stores.canvasStore.getIntersectingItemsInRect(this.registry.stores.feedback.rectSelectFeedback.rect);

        concepts.forEach((item: VisualConcept) => this.registry.stores.canvasStore.removeConcept(item));

        this.rectSelector.finish();

        this.registry.services.level.updateCurrentLevel();
        this.registry.services.game.deleteConcepts(concepts);
        this.registry.services.update.scheduleTasks(UpdateTask.All, UpdateTask.SaveData);
    }

    leave() {
        this.rectSelector.finish();
        this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    over(item: Hoverable) {
        this.registry.tools.pointer.over(item);
    }

    out(item: Hoverable) {
        this.registry.tools.pointer.out(item);
    }

    eraseAll() {
        const concepts = this.registry.stores.canvasStore.getAllConcepts();
        this.registry.services.game.deleteConcepts(concepts);
        this.registry.services.storage.clearAll();
        this.registry.stores.canvasStore.clear();
        this.registry.services.update.runImmediately(UpdateTask.All);
    }
}
