import { Registry } from '../../Registry';
import { checkHotkeyAgainstTrigger, defaultHotkeyTrigger, HotkeyTrigger, IHotkeyEvent } from '../../services/input/HotkeyService';
import { Keyboard } from '../../services/input/KeyboardService';
import { getIntersectingViews, ViewStore } from '../../stores/ViewStore';
import { AbstractCanvasPanel } from '../AbstractCanvasPanel';
import { UI_Region } from '../UI_Panel';
import { createRectFromMousePointer } from './NullTool';
import { PointerTool } from './PointerTool';
import { Cursor } from './Tool';

export const DeleteToolId = 'delete-tool';
export class DeleteTool extends PointerTool {
    private hotkeyTrigger: HotkeyTrigger = {...defaultHotkeyTrigger, ...{keyCodes: [Keyboard.e], shift: true}}

    constructor(panel: AbstractCanvasPanel, viewStore: ViewStore,  registry: Registry) {
        super(DeleteToolId, panel, viewStore, registry);
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
            this.viewStore.removeView(hoveredItem);
        }
        
        this.registry.services.level.updateCurrentLevel();
        if (this.registry.services.pointer.hoveredView) {
            this.registry.services.history.createSnapshot();
            this.registry.services.render.scheduleRendering(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
        }
    }

    
    draggedUp() {
        const intersectingViews = getIntersectingViews(this.viewStore, this.rectangleSelection);
        intersectingViews.forEach(view =>  this.viewStore.removeView(view));

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
        this.viewStore.clear();
        this.registry.services.render.reRenderAll();
    }

    getCursor() {
        return this.registry.services.pointer.hoveredView ? Cursor.Pointer : Cursor.Default;
    }

    hotkey(hotkeyEvent: IHotkeyEvent) {
        if (checkHotkeyAgainstTrigger(hotkeyEvent, this.hotkeyTrigger, this.registry)) {
            this.panel.getToolController().setSelectedTool(this.id)
            
            return true;
        }

        return false;
    }
}
