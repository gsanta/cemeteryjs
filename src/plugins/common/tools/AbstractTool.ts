import { Registry } from '../../../core/Registry';
import { IControl } from '../../../core/models/views/control/IControl';
import { IKeyboardEvent } from '../../../core/services/input/KeyboardService';
import { Tool, ToolType, Cursor } from './Tool';
import { View } from '../../../core/models/views/View';
import { Hoverable } from '../../../core/models/Hoverable';
import { IHotkeyEvent } from '../../../core/services/input/HotkeyService';
import { VisualConcept } from '../../../core/models/concepts/VisualConcept';

export class AbstractTool implements Tool {
    type: ToolType;

    getCursor() { return Cursor.Default; }
    
    protected registry: Registry;

    constructor(type: ToolType, registry: Registry) {
        this.type = type;
        this.registry = registry;
    }

    down() { }
    move() { }
    drag() { }
    click() { }
    draggedUp() { }
    up() { }
    activate() { }
    resize() { }
    wheel() {}
    wheelEnd() {}
    keydown(e: IKeyboardEvent) { }
    keyup(e: IKeyboardEvent){ }
    over(item: VisualConcept) { }
    out(item: VisualConcept) { }
    
    /**
     * Called when the mouse leaves the canvas.
     */
    leave() { }

    /**
     * Called when the tool is selected.
     */
    select(): void {}
    
    /**
     * Called when the tool is deselected.
     */
    deselect(): void {}

    setup(): void {};
    teardown(): void {};
    hotkey(hotkeyEvent: IHotkeyEvent): boolean { return false; }
}