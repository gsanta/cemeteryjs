import { checkHotkeyAgainstTrigger, defaultHotkeyTrigger, HotkeyTrigger, IHotkeyEvent } from '../../controller/HotkeyHandler';
import { Keyboard } from '../../controller/KeyboardHandler';
import { AbstractShape } from '../../models/shapes/AbstractShape';
import { Registry } from '../../Registry';
import { getIntersectingViews } from '../../stores/ShapeStore';
import { AbstractCanvasPanel } from '../AbstractCanvasPanel';
import { UI_Region } from '../UI_Panel';
import { PointerTool, PointerToolLogic } from './PointerTool';
import { Cursor } from './Tool';
import { createRectFromMousePointer } from './ToolAdapter';

export const DeleteToolId = 'delete-tool';
export class DeleteTool extends PointerTool<AbstractShape> {
    private hotkeyTrigger: HotkeyTrigger = {...defaultHotkeyTrigger, ...{keyCodes: [Keyboard.e], shift: true}}

    constructor(logic: PointerToolLogic<AbstractShape>, panel: AbstractCanvasPanel<AbstractShape>, registry: Registry) {
        super(DeleteToolId, logic, panel, registry);
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
            this.canvas.store.removeItem(hoveredItem);
        }
        
        this.registry.services.level.updateCurrentLevel();
        if (this.canvas.pointer.hoveredView) {
            this.registry.services.history.createSnapshot();
            this.registry.services.render.scheduleRendering(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
        }
    }

    
    draggedUp() {
        const intersectingViews = getIntersectingViews(this.canvas.store, this.rectangleSelection);
        intersectingViews.forEach(view =>  this.canvas.store.removeItem(view));

        this.rectangleSelection = undefined;

        this.registry.services.level.updateCurrentLevel();
        this.registry.services.history.createSnapshot();
        this.registry.services.render.scheduleRendering(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }

    leave() {
        this.rectangleSelection = undefined;
        this.registry.services.render.scheduleRendering(this.registry.ui.helper.hoveredPanel.region);
    }

    getCursor() {
        return this.canvas.pointer.hoveredView ? Cursor.Pointer : Cursor.Default;
    }

    hotkey(hotkeyEvent: IHotkeyEvent) {
        if (checkHotkeyAgainstTrigger(hotkeyEvent, this.hotkeyTrigger, this.canvas.pointer.pointer)) {
            this.canvas.tool.setSelectedTool(this.id)
            
            return true;
        }

        return false;
    }
}
