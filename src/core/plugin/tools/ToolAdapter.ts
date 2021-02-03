import { Point } from '../../../utils/geometry/shapes/Point';
import { Rectangle } from '../../../utils/geometry/shapes/Rectangle';
import { IHotkeyEvent } from '../../controller/HotkeyHandler';
import { IKeyboardEvent } from '../../controller/KeyboardHandler';
import { PointerTracker } from '../../controller/PointerHandler';
import { Registry } from '../../Registry';
import { AbstractCanvasPanel } from '../AbstractCanvasPanel';
import { Cursor, Tool } from './Tool';

export function createRectFromMousePointer(pointer: PointerTracker<any>): Rectangle {
    const minX = pointer.down.x < pointer.curr.x ? pointer.down.x : pointer.curr.x;
    const minY = pointer.down.y < pointer.curr.y ? pointer.down.y : pointer.curr.y;
    const maxX = pointer.down.x >= pointer.curr.x ? pointer.down.x : pointer.curr.x;
    const maxY = pointer.down.y >= pointer.curr.y ? pointer.down.y : pointer.curr.y;
    const rect = new Rectangle(new Point(minX, minY), new Point(maxX, maxY));

    return rect;
}

export class ToolAdapter<D> implements Tool<D> {
    rectangleSelection: Rectangle;
    id: string;
    isSelected = false;

    getCursor() { return Cursor.Default; }
    
    protected canvas: AbstractCanvasPanel<D>;
    protected registry: Registry;

    constructor(type: string, canvas: AbstractCanvasPanel<D>, registry: Registry) {
        this.id = type;
        this.canvas = canvas;
        this.registry = registry;
    }

    down(pointer: PointerTracker<D>) { }
    move(pointer: PointerTracker<D>) { }
    drag(pointer: PointerTracker<D>) { }
    click(pointer: PointerTracker<D>) { }
    dragEnd(pointer: PointerTracker<D>) { }
    up(pointer: PointerTracker<D>) { }
    activate() { }
    resize() { }
    wheel() {}
    wheelEnd() {}
    keydown(e: IKeyboardEvent) { }
    keyup(e: IKeyboardEvent){ }
    over(item: D) { }
    out(item: D) { }
    
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