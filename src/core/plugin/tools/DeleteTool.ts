import { Registry } from '../../Registry';
import { checkHotkeyAgainstTrigger, defaultHotkeyTrigger, HotkeyTrigger, IHotkeyEvent } from '../../services/input/HotkeyService';
import { Keyboard } from '../../services/input/KeyboardService';
import { getIntersectingViews } from '../../stores/ViewStore';
import { AbstractCanvasPlugin } from '../AbstractCanvasPlugin';
import { UI_Region } from '../UI_Plugin';
import { createRectFromMousePointer } from './NullTool';
import { PointerTool } from './PointerTool';
import { Cursor } from './Tool';

export const DeleteToolId = 'delete-tool';
export class DeleteTool extends PointerTool {
    private hotkeyTrigger: HotkeyTrigger = {...defaultHotkeyTrigger, ...{keyCodes: [Keyboard.e], shift: true}}

    constructor(plugin: AbstractCanvasPlugin,  registry: Registry) {
        super(DeleteToolId, plugin, registry);
    }

    drag() {
        this.rectangleSelection = createRectFromMousePointer(this.registry.services.pointer.pointer);
        this.registry.services.render.scheduleRendering(this.registry.plugins.getHoveredPlugin().region);
    }

    click() {
        const hoveredItem = this.registry.services.pointer.hoveredView;

        if (!hoveredItem) { return; }

        if (hoveredItem.isChildView()) {
            hoveredItem.parent.deleteChild(hoveredItem);
        } else {
            this.registry.stores.views.removeView(hoveredItem);
        }
        
        this.registry.services.level.updateCurrentLevel();
        if (this.registry.services.pointer.hoveredView) {
            this.registry.services.history.createSnapshot();
            this.registry.services.render.scheduleRendering(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
        }
    }

    
    draggedUp() {
        const intersectingViews = getIntersectingViews(this.registry.stores.views, this.rectangleSelection);
        intersectingViews.forEach(view =>  this.registry.stores.views.removeView(view));

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
        this.registry.stores.views.clear();
        this.registry.services.render.reRenderAll();
    }

    getCursor() {
        return this.registry.services.pointer.hoveredView ? Cursor.Pointer : Cursor.Default;
    }

    hotkey(hotkeyEvent: IHotkeyEvent) {
        if (checkHotkeyAgainstTrigger(hotkeyEvent, this.hotkeyTrigger, this.registry)) {
            this.registry.plugins.getToolController(this.plugin.id).setSelectedTool(this.id)
            
            return true;
        }

        return false;
    }
}
