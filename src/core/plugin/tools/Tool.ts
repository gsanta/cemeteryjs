import { IHotkey, IHotkeyEvent } from "../../controller/HotkeyHandler";
import { IKeyboardEvent } from "../../controller/KeyboardHandler";
import { AbstractShape } from "../../models/shapes/AbstractShape";
import { IPointerEvent } from "../../controller/PointerHandler";
import { Rectangle } from '../../../utils/geometry/shapes/Rectangle';
import { PointerTracker } from "../../controller/ToolHandler";

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

export interface Tool extends IHotkey {
    rectangleSelection: Rectangle;
    id: string;
    icon?: string;
    displayName?: string;
    isSelected: boolean;

    getCursor(): Cursor;
    down(pointer: PointerTracker): void;
    move(pointer: PointerTracker): void;
    drag(pointer: PointerTracker): void;
    click(pointer: PointerTracker): void;
    draggedUp(pointer: PointerTracker): void;
    up(pointer: PointerTracker): void;
    activate(): void;
    leave(): void;
    keydown(e: IKeyboardEvent): void;
    keyup(e: IKeyboardEvent): void;
    over(item: AbstractShape): void;
    out(item: AbstractShape): void;
    wheel(): void;
    wheelEnd(): void;

    select(): void;
    deselect(): void;

    teardown(): void;
    hotkey(hotkeyEvent: IHotkeyEvent);
}