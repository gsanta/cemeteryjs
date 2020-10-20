import { Registry } from '../../Registry';
import { IPointerEvent } from '../../services/input/PointerService';
import { getIntersectingViews } from '../../stores/ViewStore';
import { AbstractCanvasPlugin } from '../AbstractCanvasPlugin';
import { UI_Region } from '../UI_Plugin';
import { createRectFromMousePointer } from './NullTool';
import { PointerTool } from './PointerTool';
import { Cursor, ToolType } from "./Tool";

export const SelectToolId = 'select-tool';
export class SelectTool extends PointerTool {
    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(SelectToolId, plugin, registry);
    }

    down() {
        if (this.registry.services.pointer.hoveredItem && this.registry.services.pointer.hoveredItem.isSelected()) {
            super.down();
        }
    }

    click() {
        if (this.registry.services.pointer.hoveredItem) {
            super.click();
        } else if (this.registry.stores.views.getSelectedViews().length > 0) {
            this.registry.stores.views.clearSelection();
            this.registry.services.render.scheduleRendering(this.plugin.region, UI_Region.Sidepanel);
        }
    }

    drag(e: IPointerEvent) {
        if (this.movingItem) {
            super.drag(e);
        } else {
            this.rectangleSelection = createRectFromMousePointer(this.registry.services.pointer.pointer);
            this.registry.services.render.scheduleRendering(this.plugin.region);
        }
    }

    draggedUp() {
        if (this.movingItem) {
            super.draggedUp();
        } else {
            if (!this.rectangleSelection) { return }
    
            const intersectingViews = getIntersectingViews(this.registry.stores.views, this.rectangleSelection);
            
            this.registry.stores.views.clearSelection();
            this.registry.stores.views.addSelectedView(...intersectingViews)
    
            this.rectangleSelection = undefined;
            this.registry.services.render.scheduleRendering(this.plugin.region, UI_Region.Sidepanel);
        }
    }

    getCursor() {
        if (this.registry.services.pointer.hoveredItem) {
            return Cursor.Pointer;
        }

        return Cursor.Default;
    }
}