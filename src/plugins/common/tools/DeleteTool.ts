import { Registry } from '../../../core/Registry';
import { checkHotkeyAgainstTrigger, defaultHotkeyTrigger, IHotkeyEvent, HotkeyTrigger } from '../../../core/services/input/HotkeyService';
import { Keyboard } from '../../../core/services/input/KeyboardService';
import { RenderTask } from '../../../core/services/RenderServices';
import { isView, isFeedback } from '../../../core/stores/SceneStore';
import { AbstractTool } from './AbstractTool';
import { RectangleSelector } from './RectangleSelector';
import { Cursor, ToolType } from './Tool';
import { View } from '../../../core/models/views/View';
import { AbstractPlugin } from '../../../core/AbstractPlugin';

export class DeleteTool extends AbstractTool {
    private hotkeyTrigger: HotkeyTrigger = {...defaultHotkeyTrigger, ...{keyCodes: [Keyboard.e], shift: true}}
    private rectSelector: RectangleSelector;

    constructor(plugin: AbstractPlugin, registry: Registry) {
        super(ToolType.Delete, plugin, registry);
        this.rectSelector = new RectangleSelector(registry);
    }

    drag() {
        this.rectSelector.updateRect(this.registry.services.pointer.pointer);
        this.registry.services.render.scheduleTasks(RenderTask.RenderFocusedView);
    }

    click() {
        this.plugin.getToolById(ToolType.Pointer).click();
        const hoveredItem = this.registry.services.pointer.hoveredItem;

        if (!hoveredItem) { return; }

        if (isFeedback(hoveredItem.viewType)) {
            hoveredItem.delete();
        } else if (isView(hoveredItem.viewType)) {
            this.getStore().removeItem(hoveredItem);
        }
        
        this.registry.services.level.updateCurrentLevel();
        if (this.registry.services.pointer.hoveredItem) {
            this.registry.services.history.createSnapshot();
            this.registry.services.render.scheduleTasks(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);
        }
    }

    
    draggedUp() {
        const views = this.getStore().getIntersectingItemsInRect(this.registry.stores.feedback.rectSelectFeedback.rect);
        views.forEach(view =>  this.getStore().removeItem(view));

        this.rectSelector.finish();

        this.registry.services.level.updateCurrentLevel();
        this.registry.services.history.createSnapshot();
        this.registry.services.render.scheduleTasks(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);
    }

    leave() {
        this.rectSelector.finish();
        this.registry.services.render.scheduleTasks(RenderTask.RenderFocusedView);
    }

    over(item: View) {
        this.plugin.getToolById(ToolType.Pointer).over(item);
    }

    out(item: View) {
        this.plugin.getToolById(ToolType.Pointer).over(item);
    }

    eraseAll() {
        const concepts = this.registry.stores.canvasStore.getAllViews();
        this.registry.services.localStore.clearAll();
        // TODO: erase all differently
        // this.registry.plugins.plugins.forEach(plugin => plugin.getStore()?.clear());
        this.registry.stores.canvasStore.clear();
        this.registry.services.render.runImmediately(RenderTask.RenderFull);
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
