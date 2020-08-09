import { AbstractPlugin } from '../../../core/AbstractPlugin';
import { Registry } from '../../../core/Registry';
import { IHotkeyEvent } from '../../../core/services/input/HotkeyService';
import { IKeyboardEvent } from '../../../core/services/input/KeyboardService';
import { Cursor, Tool, ToolType } from './Tool';
import { View } from '../../../core/models/views/View';
import { IPointerEvent } from '../../../core/services/input/PointerService';
import { AbstractViewStore } from '../../../core/stores/AbstractViewStore';
import { Rectangle } from '../../../core/geometry/shapes/Rectangle';
import { MousePointer } from '../../../core/services/input/MouseService';
import { Point } from '../../../core/geometry/shapes/Point';

export function createRectFromMousePointer(pointer: MousePointer): Rectangle {
    const minX = pointer.down.x < pointer.curr.x ? pointer.down.x : pointer.curr.x;
    const minY = pointer.down.y < pointer.curr.y ? pointer.down.y : pointer.curr.y;
    const maxX = pointer.down.x >= pointer.curr.x ? pointer.down.x : pointer.curr.x;
    const maxY = pointer.down.y >= pointer.curr.y ? pointer.down.y : pointer.curr.y;
    const rect = new Rectangle(new Point(minX, minY), new Point(maxX, maxY));

    return rect;
}

export class AbstractTool implements Tool {
    rectangleSelection: Rectangle;
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