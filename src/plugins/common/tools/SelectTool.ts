import { Registry } from '../../../core/Registry';
import { RenderTask } from "../../../core/services/RenderServices";
import { PointerTool } from './PointerTool';
import { RectangleSelector } from "./RectangleSelector";
import { ToolType, Cursor } from "./Tool";
import { IPointerEvent } from '../../../core/services/input/PointerService';
import { AbstractPlugin } from '../../../core/AbstractPlugin';
import { UI_Region } from '../../../core/UI_Plugin';

export class SelectTool extends PointerTool {
    private rectSelector: RectangleSelector;

    constructor(plugin: AbstractPlugin, registry: Registry) {
        super(ToolType.Select, plugin, registry);
        this.rectSelector = new RectangleSelector(registry);
    }

    down() {
        if (this.registry.stores.selectionStore.contains(this.registry.services.pointer.hoveredItem)) {
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
            this.rectSelector.updateRect(this.registry.services.pointer.pointer);
            this.registry.services.render.scheduleRendering(this.plugin.region);
        }
    }

    draggedUp() {
        if (this.movingItem) {
            super.draggedUp();
        } else {
            const feedback = this.registry.stores.feedback.rectSelectFeedback;
            if (!feedback) { return }
    
            const canvasItems = this.registry.stores.canvasStore.getIntersectingItemsInRect(feedback.rect);
            
            this.registry.stores.selectionStore.clear();
            this.registry.stores.selectionStore.addItem(...canvasItems)
    
            this.rectSelector.finish();
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