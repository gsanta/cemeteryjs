import { Registry } from '../../editor/Registry';
import { AbstractTool } from './AbstractTool';
import { Cursor, ToolType } from "./Tool";

export class DraggAndDropTool extends AbstractTool {
    cursor = Cursor.Grab;

    isDragging = false;

    constructor(registry: Registry) {
        super(ToolType.DragAndDrop, registry);

    }

    select() {
        this.isDragging = true;
    }

    up() {
        this.isDragging = false;
    }
}