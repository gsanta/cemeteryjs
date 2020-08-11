import { Registry } from '../../Registry';
import { checkHotkeyAgainstTrigger, defaultHotkeyTrigger, IHotkeyEvent, HotkeyTrigger } from '../../services/input/HotkeyService';
import { Keyboard } from '../../services/input/KeyboardService';
import { isView, isFeedback } from '../../stores/SceneStore';
import { AbstractTool, createRectFromMousePointer } from './AbstractTool';
import { RectangleSelector } from './RectangleSelector';
import { Cursor, ToolType } from './Tool';
import { View } from '../../stores/views/View';
import { AbstractCanvasPlugin } from '../AbstractCanvasPlugin';
import { UI_Region } from '../UI_Plugin';

export class DeleteTool extends AbstractTool {
    private hotkeyTrigger: HotkeyTrigger = {...defaultHotkeyTrigger, ...{keyCodes: [Keyboard.e], shift: true}}

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(ToolType.Delete, plugin, registry);
    }

    drag() {
        this.rectangleSelection = createRectFromMousePointer(this.registry.services.pointer.pointer);
        this.registry.services.render.scheduleRendering(this.registry.services.pointer.hoveredPlugin.region);
    }

    click() {
        this.plugin.toolHandler.getById(ToolType.Pointer).click();
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
            this.registry.services.render.scheduleRendering(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
        }
    }

    
    draggedUp() {
        const views = this.getStore().getIntersectingItemsInRect(this.rectangleSelection);
        views.forEach(view =>  this.getStore().removeItem(view));

        this.rectangleSelection = undefined;

        this.registry.services.level.updateCurrentLevel();
        this.registry.services.history.createSnapshot();
        this.registry.services.render.scheduleRendering(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }

    leave() {
        this.rectangleSelection = undefined;
        this.registry.services.render.scheduleRendering(this.registry.services.pointer.hoveredPlugin.region);
    }

    over(item: View) {
        this.plugin.toolHandler.getById(ToolType.Pointer).over(item);
    }

    out(item: View) {
        this.plugin.toolHandler.getById(ToolType.Pointer).over(item);
    }

    eraseAll() {
        const concepts = this.registry.stores.canvasStore.getAllViews();
        this.registry.services.localStore.clearAll();
        // TODO: erase all differently
        // this.registry.plugins.plugins.forEach(plugin => plugin.getStore()?.clear());
        this.registry.stores.canvasStore.clear();
        this.registry.services.render.reRenderAll();
    }

    getCursor() {
        return this.registry.services.pointer.hoveredItem ? Cursor.Pointer : Cursor.Default;
    }

    hotkey(hotkeyEvent: IHotkeyEvent) {
        if (checkHotkeyAgainstTrigger(hotkeyEvent, this.hotkeyTrigger, this.registry)) {
            this.getPlugin().toolHandler.setSelectedTool(this.id);
            return true;
        }

        return false;
    }
}
