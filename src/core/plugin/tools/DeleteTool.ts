import { Registry } from '../../Registry';
import { checkHotkeyAgainstTrigger, defaultHotkeyTrigger, HotkeyTrigger, IHotkeyEvent } from '../../services/input/HotkeyService';
import { Keyboard } from '../../services/input/KeyboardService';
import { getIntersectingViews } from '../../stores/ViewStore';
import { AbstractCanvasPlugin } from '../AbstractCanvasPlugin';
import { UI_Region } from '../UI_Plugin';
import { createRectFromMousePointer } from './AbstractTool';
import { PointerTool } from './PointerTool';
import { Cursor, ToolType } from './Tool';

export class DeleteTool extends PointerTool {
    private hotkeyTrigger: HotkeyTrigger = {...defaultHotkeyTrigger, ...{keyCodes: [Keyboard.e], shift: true}}

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(ToolType.Delete, plugin, registry);
    }

    drag() {
        this.rectangleSelection = createRectFromMousePointer(this.registry.services.pointer.pointer);
        this.registry.services.render.scheduleRendering(this.registry.plugins.getHoveredPlugin().region);
    }

    click() {
        const hoveredItem = this.registry.services.pointer.hoveredItem;

        if (!hoveredItem) { return; }

        if (hoveredItem.isChildView()) {
            hoveredItem.parent.deleteChild(hoveredItem);
        } else {
            this.registry.stores.viewStore.removeView(hoveredItem);
        }
        
        this.registry.services.level.updateCurrentLevel();
        if (this.registry.services.pointer.hoveredItem) {
            this.registry.services.history.createSnapshot();
            this.registry.services.render.scheduleRendering(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
        }
    }

    
    draggedUp() {
        const intersectingViews = getIntersectingViews(this.registry.stores.viewStore, this.rectangleSelection);
        intersectingViews.forEach(view =>  this.registry.stores.viewStore.removeView(view));

        this.rectangleSelection = undefined;

        this.registry.services.level.updateCurrentLevel();
        this.registry.services.history.createSnapshot();
        this.registry.services.render.scheduleRendering(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }

    leave() {
        this.rectangleSelection = undefined;
        this.registry.services.render.scheduleRendering(this.registry.plugins.getHoveredPlugin().region);
    }

    eraseAll() {
        this.registry.services.localStore.clearAll();
        this.registry.stores.viewStore.clear();
        this.registry.services.render.reRenderAll();
    }

    getCursor() {
        return this.registry.services.pointer.hoveredItem ? Cursor.Pointer : Cursor.Default;
    }

    hotkey(hotkeyEvent: IHotkeyEvent) {
        if (checkHotkeyAgainstTrigger(hotkeyEvent, this.hotkeyTrigger, this.registry)) {
            this.plugin.toolHandler.setSelectedTool(this.id);
            return true;
        }

        return false;
    }
}
