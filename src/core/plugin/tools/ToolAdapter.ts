import { Point } from '../../../utils/geometry/shapes/Point';
import { Rectangle } from '../../../utils/geometry/shapes/Rectangle';
import { AbstractShape } from '../../models/shapes/AbstractShape';
import { Registry } from '../../Registry';
import { IHotkeyEvent } from '../../controller/HotkeyHandler';
import { IKeyboardEvent } from '../../controller/KeyboardHandler';
import { IPointerEvent } from '../../controller/PointerHandler';
import { AbstractCanvasPanel } from '../AbstractCanvasPanel';
import { PointerTracker } from '../../controller/ToolHandler';
import { Cursor, Tool } from './Tool';

export function createRectFromMousePointer(pointer: PointerTracker): Rectangle {
    const minX = pointer.down.x < pointer.curr.x ? pointer.down.x : pointer.curr.x;
    const minY = pointer.down.y < pointer.curr.y ? pointer.down.y : pointer.curr.y;
    const maxX = pointer.down.x >= pointer.curr.x ? pointer.down.x : pointer.curr.x;
    const maxY = pointer.down.y >= pointer.curr.y ? pointer.down.y : pointer.curr.y;
    const rect = new Rectangle(new Point(minX, minY), new Point(maxX, maxY));

    return rect;
}

export class ToolAdapter<P extends AbstractCanvasPanel = AbstractCanvasPanel> implements Tool {
    rectangleSelection: Rectangle;
    id: string;
    isSelected = false;

    getCursor() { return Cursor.Default; }
    
    protected canvas: P;
    protected registry: Registry;

    constructor(type: string, panel: P, registry: Registry) {
        this.id = type;
        this.canvas = panel;
        this.registry = registry;
    }

    down(pointer: PointerTracker) { }
    move(pointer: PointerTracker) { }
    drag(pointer: PointerTracker) { }
    click(pointer: PointerTracker) { }
    draggedUp(pointer: PointerTracker) { }
    up(pointer: PointerTracker) { }
    activate() { }
    resize() { }
    wheel() {}
    wheelEnd() {}
    keydown(e: IKeyboardEvent) { }
    keyup(e: IKeyboardEvent){ }
    over(item: AbstractShape) { }
    out(item: AbstractShape) { }
    
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