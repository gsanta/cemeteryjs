import { Registry } from '../../Registry';
import { PointerTool } from './PointerTool';
import { ToolType, Cursor } from "./Tool";
import { IPointerEvent } from '../../services/input/PointerService';
import { AbstractCanvasPlugin } from '../AbstractCanvasPlugin';
import { UI_Region } from '../UI_Plugin';
import { createRectFromMousePointer } from './AbstractTool';

export class SelectTool extends PointerTool {
    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(ToolType.Select, plugin, registry);
    }

    down() {
        if (this.registry.services.pointer.hoveredItem && this.registry.services.pointer.hoveredItem.isSelected()) {
            super.down();
        }
    }

    click() {
        if (this.registry.services.pointer.hoveredItem) {
            super.click();
        } else if (this.registry.stores.selectionStore.getAll().length > 0) {
            this.registry.stores.selectionStore.clear();
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
    
            const canvasItems = this.registry.stores.canvasStore.getIntersectingItemsInRect(this.rectangleSelection);
            
            this.registry.stores.selectionStore.clear();
            this.registry.stores.selectionStore.addItem(...canvasItems)
    
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