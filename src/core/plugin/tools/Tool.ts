import { IHotkey, IHotkeyEvent } from "../../services/input/HotkeyService";
import { IKeyboardEvent } from "../../services/input/KeyboardService";
import { AbstractShape } from "../../models/views/AbstractShape";
import { IPointerEvent } from "../../services/input/PointerService";
import { Rectangle } from '../../../utils/geometry/shapes/Rectangle';

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
    down(e: IPointerEvent): void;
    move(): void;
    drag(e: IPointerEvent): void;
    click(): void;
    draggedUp(): void;
    up(e: IPointerEvent): void;
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