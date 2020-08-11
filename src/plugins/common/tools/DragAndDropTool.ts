import { Registry } from '../../../core/Registry';
import { RenderTask } from '../../../core/services/RenderServices';
import { AbstractTool } from './AbstractTool';
import { Cursor, ToolType } from "./Tool";
import { AbstractCanvasPlugin } from '../../../core/plugins/AbstractCanvasPlugin';

export interface DroppableItem {
    itemType: string;
}

export class DragAndDropTool extends AbstractTool {
    isDragging = false;

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(ToolType.DragAndDrop, plugin, registry);
    }

    select() {
        this.isDragging = true;
        this.registry.services.render.reRender(this.plugin.region);
    }

    deselect() {
        this.isDragging = false;
    }
    
    up() {
        this.isDragging = false;
        const nodeType = this.registry.services.pointer.pointer.droppedItemType;
        if (nodeType !== undefined) {
            this.registry.stores.nodeStore.addDroppable(this.registry.services.pointer.droppableItem, this.registry.services.pointer.pointer.curr.clone());
            this.registry.services.render.scheduleRendering(this.plugin.region);
            this.registry.services.history.createSnapshot();
        }
    }

    getCursor() {
        return Cursor.Grab;
    }
}