import { IHotkey, IHotkeyEvent } from "../HotkeyHandler";
import { IKeyboardEvent } from "../KeyboardHandler";
import { Rectangle } from '../../../utils/geometry/shapes/Rectangle';
import { PointerTracker } from "../PointerHandler";

export enum ToolType {
    Rectangle = 'rectangle',
    Delete = 'delete',
    Select = 'select',
    Move = 'move',
    DragAndDrop = 'drag-and-drop',
    Camera = 'camera',
    Path = 'path',
    Pointer = 'pointer',
    Gamepad = 'gamepad',
    Join = 'join',
    Sprite = 'Sprite'
}

export enum Cursor {
    Default = 'default',
    Pointer = 'pointer',
    Grab = 'grab',
    Crosshair = 'crosshair',
    Move = 'move',
    ZoomIn = 'zoom-in',
    N_Resize = 'n-resize',
    W_Resize = 'w-resize',
    NE_Resize = 'ne-resize'
}

export interface Tool<D> extends IHotkey {
    rectangleSelection: Rectangle;
    id: string;
    icon?: string;
    displayName?: string;
    isSelected: boolean;

    getCursor(): Cursor;
    down(pointer: PointerTracker<D>): void;
    move(pointer: PointerTracker<D>): void;
    drag(pointer: PointerTracker<D>): void;
    click(pointer: PointerTracker<D>): void;
    dragEnd(pointer: PointerTracker<D>): void;
    up(pointer: PointerTracker<D>): void;
    activate(): void;
    leave(): void;
    keydown(e: IKeyboardEvent): void;
    keyup(e: IKeyboardEvent): void;
    over(item: D): void;
    out(item: D): void;
    wheel(): void;
    wheelEnd(): void;

    select(): void;
    deselect(): void;

    teardown(): void;
    hotkey(hotkeyEvent: IHotkeyEvent);
}