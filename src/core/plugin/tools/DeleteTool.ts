import { Registry } from '../../Registry';
import { checkHotkeyAgainstTrigger, defaultHotkeyTrigger, HotkeyTrigger, IHotkeyEvent } from '../../services/input/HotkeyService';
import { Keyboard } from '../../services/input/KeyboardService';
import { getIntersectingViews, ShapeStore } from '../../stores/ShapeStore';
import { AbstractCanvasPanel } from '../AbstractCanvasPanel';
import { UI_Region } from '../UI_Panel';
import { createRectFromMousePointer } from './ToolAdapter';
import { PointerTool } from './PointerTool';
import { Cursor } from './Tool';

export const DeleteToolId = 'delete-tool';
export class DeleteTool extends PointerTool {
    private hotkeyTrigger: HotkeyTrigger = {...defaultHotkeyTrigger, ...{keyCodes: [Keyboard.e], shift: true}}

    constructor(panel: AbstractCanvasPanel, viewStore: ShapeStore,  registry: Registry) {
        super(DeleteToolId, panel, viewStore, registry);
    }

    drag() {
        this.rectangleSelection = createRectFromMousePointer(this.canvas.pointer.pointer);
        this.registry.services.render.scheduleRendering(this.registry.ui.helper.hoveredPanel.region);
    }

    click() {
        const hoveredItem = this.canvas.pointer.hoveredView;

        if (!hoveredItem) { return; }

        if (hoveredItem.isContainedView()) {
            hoveredItem.containerShape.deleteContainedView(hoveredItem);
        } else {
            this.viewStore.removeShape(hoveredItem);
        }
        
        this.registry.services.level.updateCurrentLevel();
        if (this.canvas.pointer.hoveredView) {
            this.registry.services.history.createSnapshot();
            this.registry.services.render.scheduleRendering(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
        }
    }

    
    draggedUp() {
        const intersectingViews = getIntersectingViews(this.viewStore, this.rectangleSelection);
        intersectingViews.forEach(view =>  this.viewStore.removeShape(view));

        this.rectangleSelection = undefined;

        this.registry.services.level.updateCurrentLevel();
        this.registry.services.history.createSnapshot();
        this.registry.services.render.scheduleRendering(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }

    leave() {
        this.rectangleSelection = undefined;
        this.registry.services.render.scheduleRendering(this.registry.ui.helper.hoveredPanel.region);
    }

    eraseAll() {
        this.registry.services.localStore.clearAll();
        this.viewStore.clear();
        this.registry.services.render.reRenderAll();
    }

    getCursor() {
        return this.canvas.pointer.hoveredView ? Cursor.Pointer : Cursor.Default;
    }

    hotkey(hotkeyEvent: IHotkeyEvent) {
        if (checkHotkeyAgainstTrigger(hotkeyEvent, this.hotkeyTrigger, this.canvas.pointer.pointer)) {
            this.canvas.toolController.setSelectedTool(this.id)
            
            return true;
        }

        return false;
    }
}
