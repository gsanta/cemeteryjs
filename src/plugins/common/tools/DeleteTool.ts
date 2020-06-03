import { Registry } from '../../../core/Registry';
import { checkHotkeyAgainstTrigger, defaultHotkeyTrigger, IHotkeyEvent, HotkeyTrigger } from '../../../core/services/input/HotkeyService';
import { Keyboard } from '../../../core/services/input/KeyboardService';
import { RenderTask } from '../../../core/services/RenderServices';
import { isConcept, isControl } from '../../../core/stores/SceneStore';
import { AbstractTool } from './AbstractTool';
import { RectangleSelector } from './RectangleSelector';
import { Cursor, ToolType } from './Tool';
import { View } from '../../../core/models/views/View';

export class DeleteTool extends AbstractTool {
    private hotkeyTrigger: HotkeyTrigger = {...defaultHotkeyTrigger, ...{keyCodes: [Keyboard.e], shift: true}}
    private rectSelector: RectangleSelector;

    constructor(registry: Registry) {
        super(ToolType.Delete, registry);
        this.rectSelector = new RectangleSelector(registry);
    }

    drag() {
        this.rectSelector.updateRect(this.registry.services.pointer.pointer);
        this.registry.services.update.scheduleTasks(RenderTask.RepaintCanvas);
    }

    click() {
        this.registry.tools.pointer.click();
        const hoveredItem = this.registry.services.pointer.hoveredItem;

        if (!hoveredItem) { return; }

        if (isControl(hoveredItem.type)) {
            hoveredItem.delete();
        } else if (isConcept(hoveredItem.type)) {
            this.getStore().removeItem(hoveredItem);
        }
        
        this.registry.services.level.updateCurrentLevel();
        if (this.registry.services.pointer.hoveredItem) {
            this.registry.services.history.createSnapshot();
            this.registry.services.update.scheduleTasks(RenderTask.All);
        }
    }

    
    draggedUp() {
        const views = this.getStore().getIntersectingItemsInRect(this.registry.stores.feedback.rectSelectFeedback.rect);
        views.forEach(view =>  this.getStore().removeItem(view));

        this.rectSelector.finish();

        this.registry.services.level.updateCurrentLevel();
        this.registry.services.game.deleteConcepts(views);
        this.registry.services.history.createSnapshot();
        this.registry.services.update.scheduleTasks(RenderTask.All);
    }

    leave() {
        this.rectSelector.finish();
        this.registry.services.update.scheduleTasks(RenderTask.RepaintCanvas);
    }

    over(item: View) {
        this.registry.tools.pointer.over(item);
    }

    out(item: View) {
        this.registry.tools.pointer.out(item);
    }

    eraseAll() {
        const concepts = this.registry.stores.canvasStore.getAllConcepts();
        this.registry.services.game.deleteConcepts(concepts);
        this.registry.services.localStore.clearAll();
        this.registry.services.plugin.plugins.forEach(plugin => plugin.getStore()?.clear());
        this.registry.stores.canvasStore.clear();
        this.registry.services.update.runImmediately(RenderTask.All);
    }

    getCursor() {
        return this.registry.services.pointer.hoveredItem ? Cursor.Pointer : Cursor.Default;
    }

    hotkey(hotkeyEvent: IHotkeyEvent) {
        if (checkHotkeyAgainstTrigger(hotkeyEvent, this.hotkeyTrigger, this.registry)) {
            this.getPlugin().setSelectedTool(this);
            return true;
        }

        return false;
    }
}
