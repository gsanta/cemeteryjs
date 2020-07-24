import { AbstractPlugin } from '../../../core/AbstractPlugin';
import { Registry } from '../../../core/Registry';
import { IHotkeyEvent } from '../../../core/services/input/HotkeyService';
import { IKeyboardEvent } from '../../../core/services/input/KeyboardService';
import { Cursor, Tool, ToolType } from './Tool';
import { View } from '../../../core/models/views/View';
import { IPointerEvent } from '../../../core/services/input/PointerService';
import { AbstractViewStore } from '../../../core/stores/AbstractViewStore';

export class AbstractTool implements Tool {
    id: ToolType;

    getCursor() { return Cursor.Default; }
    
    protected plugin: AbstractPlugin;
    protected registry: Registry;

    constructor(type: ToolType, plugin: AbstractPlugin, registry: Registry) {
        this.id = type;
        this.plugin = plugin;
        this.registry = registry;
    }

    down(e: IPointerEvent) { }
    move() { }
    drag(e: IPointerEvent) { }
    click() { }
    draggedUp() { }
    up(e: IPointerEvent) { }
    activate() { }
    resize() { }
    wheel() {}
    wheelEnd() {}
    keydown(e: IKeyboardEvent) { }
    keyup(e: IKeyboardEvent){ }
    over(item: View) { }
    out(item: View) { }
    
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

    teardown(): void {};
    hotkey(hotkeyEvent: IHotkeyEvent): boolean { return false; }

    protected getStore(): AbstractViewStore {
        return this.registry.plugins.getHoveredView().getStore();
    }

    protected getPlugin(): AbstractPlugin {
        return this.registry.plugins.getHoveredView();
    }
}