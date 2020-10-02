import { AbstractCanvasPlugin } from '../AbstractCanvasPlugin';
import { Registry } from '../../Registry';
import { IHotkeyEvent } from '../../services/input/HotkeyService';
import { IKeyboardEvent } from '../../services/input/KeyboardService';
import { Cursor, Tool, ToolType } from './Tool';
import { View } from '../../models/views/View';
import { IPointerEvent } from '../../services/input/PointerService';
import { ViewStore } from '../../stores/ViewStore';
import { Rectangle } from '../../../utils/geometry/shapes/Rectangle';
import { MousePointer } from '../controller/ToolController';
import { Point } from '../../../utils/geometry/shapes/Point';

export function createRectFromMousePointer(pointer: MousePointer): Rectangle {
    const minX = pointer.down.x < pointer.curr.x ? pointer.down.x : pointer.curr.x;
    const minY = pointer.down.y < pointer.curr.y ? pointer.down.y : pointer.curr.y;
    const maxX = pointer.down.x >= pointer.curr.x ? pointer.down.x : pointer.curr.x;
    const maxY = pointer.down.y >= pointer.curr.y ? pointer.down.y : pointer.curr.y;
    const rect = new Rectangle(new Point(minX, minY), new Point(maxX, maxY));

    return rect;
}

export class NullTool implements Tool {
    rectangleSelection: Rectangle;
    id: string;

    getCursor() { return Cursor.Default; }
    
    protected plugin: AbstractCanvasPlugin;
    protected registry: Registry;

    constructor(type: string, plugin: AbstractCanvasPlugin, registry: Registry) {
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
}