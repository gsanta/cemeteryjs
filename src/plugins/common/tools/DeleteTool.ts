import { VisualConcept } from '../../../core/models/concepts/VisualConcept';
import { Hoverable } from '../../../core/models/Hoverable';
import { Registry } from '../../../core/Registry';
import { UpdateTask } from '../../../core/services/UpdateServices';
import { isConcept, isControl } from '../../../core/stores/CanvasStore';
import { AbstractTool } from './AbstractTool';
import { RectangleSelector } from './RectangleSelector';
import { ToolType, Cursor } from './Tool';
import { IControl } from '../../../core/models/controls/IControl';

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
        const hoveredItem = this.registry.services.pointer.hoveredItem;

        if (!hoveredItem) { return; }

        if (isControl(hoveredItem.type)) {
            (<IControl<any>> hoveredItem).delete();
        } else if (isConcept(hoveredItem.type)) {
            this.registry.views.getActiveView().getStore().removeItemById(hoveredItem.id);
        }
        
        this.registry.services.level.updateCurrentLevel();
        hoverStore.hasAny() && this.registry.services.update.scheduleTasks(UpdateTask.All, UpdateTask.SaveData);
    }

    
    draggedUp() {
        const store = this.registry.views.getActiveView().getStore();

        const views = store.getIntersectingItemsInRect(this.registry.stores.feedback.rectSelectFeedback.rect);
        views.forEach((item: VisualConcept) => store.removeItemById(item.id));

        this.rectSelector.finish();

        this.registry.services.level.updateCurrentLevel();
        this.registry.services.game.deleteConcepts(views);
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

    getCursor() {
        return this.registry.services.pointer.hoveredItem ? Cursor.Pointer : Cursor.Default;
    }
}
