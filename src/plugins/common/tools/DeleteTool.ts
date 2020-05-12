import { Registry } from '../../../core/Registry';
import { VisualConcept } from '../../../core/models/concepts/VisualConcept';
import { IControl } from '../../../core/models/controls/IControl';
import { UpdateTask } from '../../../core/services/UpdateServices';
import { AbstractTool } from './AbstractTool';
import { RectangleSelector } from './RectangleSelector';
import { ToolType } from './Tool';
import { Hoverable } from '../../../core/models/Hoverable';

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

        if (hoverStore.hasAny()) {
            if (hoverStore.hasEditPoint()) {
                hoverStore.getConcept().deleteEditPoint(hoverStore.getEditPoint());
            } else {
                const concept = hoverStore.getConcept();
                this.registry.stores.canvasStore.removeConcept(concept);
                this.registry.services.game.deleteConcepts([concept]);
            }
            
            this.registry.services.level.updateCurrentLevel();
            hoverStore.hasAny() && this.registry.services.update.scheduleTasks(UpdateTask.All, UpdateTask.SaveData);
        }
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
