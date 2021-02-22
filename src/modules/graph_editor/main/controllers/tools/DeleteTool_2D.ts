import { checkHotkeyAgainstTrigger, defaultHotkeyTrigger, HotkeyTrigger, IHotkeyEvent } from '../../../../../core/controller/HotkeyHandler';
import { Keyboard } from '../../../../../core/controller/KeyboardHandler';
import { AbstractShape } from '../../models/shapes/AbstractShape';
import { Registry } from '../../../../../core/Registry';
import { getIntersectingViews } from '../../../../../core/data/stores/ShapeStore';
import { AbstractCanvasPanel } from '../../../../../core/models/modules/AbstractCanvasPanel';
import { UI_Region } from '../../../../../core/models/UI_Panel';
import { AbstractTool, createRectFromMousePointer } from '../../../../../core/controller/tools/AbstractTool';
import { Cursor } from '../../../../../core/controller/tools/Tool';

export const DeleteToolId = 'delete-tool';
export class DeleteTool_2D extends AbstractTool<AbstractShape> {
    private hotkeyTrigger: HotkeyTrigger = {...defaultHotkeyTrigger, ...{keyCodes: [Keyboard.e], shift: true}}

    constructor(panel: AbstractCanvasPanel<AbstractShape>, registry: Registry) {
        super(DeleteToolId, panel, registry);
    }

    drag() {
        this.rectangleSelection = createRectFromMousePointer(this.canvas.pointer.pointer);
        this.registry.services.render.scheduleRendering(this.registry.ui.helper.hoveredPanel.region);
    }

    click() {
        const hoveredItem = this.canvas.pointer.pointer.hoveredItem;

        if (!hoveredItem) { return; }

        if (hoveredItem.isContainedView()) {
            hoveredItem.containerShape.deleteContainedView(hoveredItem);
        } else {
            this.canvas.data.items.remove(hoveredItem);
        }
        
        this.registry.services.level.updateCurrentLevel();
        if (this.canvas.pointer.pointer.hoveredItem) {
            this.registry.services.history.createSnapshot();
            this.registry.services.render.scheduleRendering(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
        }
    }

    
    dragEnd() {
        const intersectingViews = getIntersectingViews(this.canvas.data.items, this.rectangleSelection);
        intersectingViews.forEach(view =>  this.canvas.data.items.remove(view));

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
        return this.canvas.pointer.pointer.hoveredItem ? Cursor.Pointer : Cursor.Default;
    }

    hotkey(hotkeyEvent: IHotkeyEvent) {
        if (checkHotkeyAgainstTrigger(hotkeyEvent, this.hotkeyTrigger, this.canvas.pointer.pointer)) {
            this.canvas.tool.setSelectedTool(this.id)
            
            return true;
        }

        return false;
    }
}
