import { Registry } from '../../Registry';
import { IPointerEvent } from '../../services/input/PointerService';
import { getIntersectingViews } from '../../stores/ViewStore';
import { UI_Region } from '../UI_Panel';
import { UI_Plugin } from '../UI_Plugin';
import { createRectFromMousePointer } from './NullTool';
import { PointerTool } from './PointerTool';
import { Cursor } from "./Tool";

export const SelectToolId = 'select-tool';
export class SelectTool extends PointerTool {
    constructor(plugin: UI_Plugin, registry: Registry) {
        super(SelectToolId, plugin, registry);
    }

    down() {
        if (this.registry.services.pointer.hoveredView && this.registry.services.pointer.hoveredView.isSelected()) {
            super.down();
        }
    }

    click() {
        if (this.registry.services.pointer.hoveredView) {
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
        if (this.registry.services.pointer.hoveredView) {
            return Cursor.Pointer;
        }

        return Cursor.Default;
    }
}