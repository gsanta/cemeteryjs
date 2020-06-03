import { Registry } from '../../../core/Registry';
import { RenderTask } from '../../../core/services/RenderServices';
import { AbstractTool } from './AbstractTool';
import { Cursor, ToolType } from "./Tool";

export interface DroppableItem {
    itemType: string;
}

export class DragAndDropTool extends AbstractTool {
    isDragging = false;

    constructor(registry: Registry) {
        super(ToolType.DragAndDrop, registry);
    }

    select() {
        this.isDragging = true;
        this.registry.services.update.runImmediately(RenderTask.RenderFocusedView);
    }

    deselect() {
        this.isDragging = false;
    }
    
    up() {
        this.isDragging = false;
        const nodeType = this.registry.services.pointer.pointer.droppedItemType;
        if (nodeType !== undefined) {
            this.registry.stores.nodeStore.addDroppable(this.registry.services.pointer.droppableItem, this.registry.services.pointer.pointer.curr.clone());
            this.registry.services.update.scheduleTasks(RenderTask.RenderFocusedView);
            this.registry.services.history.createSnapshot();
        }
    }

    getCursor() {
        return Cursor.Grab;
    }
}