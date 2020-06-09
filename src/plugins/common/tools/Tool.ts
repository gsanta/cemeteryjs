import { IHotkey, IHotkeyEvent } from "../../../core/services/input/HotkeyService";
import { IKeyboardEvent } from "../../../core/services/input/KeyboardService";
import { View } from "../../../core/models/views/View";
import { IPointerEvent } from "../../../core/services/input/PointerService";

export enum ToolType {
    Rectangle = 'rectangle',
    Delete = 'delete',
    Select = 'select',
    Move = 'move',
    Pan = 'pan',
    DragAndDrop = 'drag-and-drop',
    Zoom = 'zoom',
    Path = 'path',
    Pointer = 'pointer',
    Gamepad = 'gamepad',
    Join = 'join'
}

export class ToolReturnType {
    _lookDirty: boolean = false;
    _contentDirty?: boolean = false;
    _dirty?: boolean = false

    lookDirty() {
        this._lookDirty = true;
        this._dirty = true;
        return this;
    }

    contentDirty() {
        this._contentDirty = true;
        this._dirty = true;
        return this;
    }
}

export enum Cursor {
    Default = 'default',
    Pointer = 'pointer',
    Grab = 'grab',
    Crosshair = 'crosshair',
    Move = 'move',
    ZoomIn = 'zoom-in'
}

export interface Tool extends IHotkey {
    getCursor(): Cursor;
    type: ToolType;
    down(e: IPointerEvent): void;
    move(): void;
    drag(e: IPointerEvent): void;
    click(): void;
    draggedUp(): void;
    up(): void;
    activate(): void;
    leave(): void;
    keydown(e: IKeyboardEvent): void;
    keyup(e: IKeyboardEvent): void;
    over(item: View): void;
    out(item: View): void;
    wheel(): void;
    wheelEnd(): void;

    select(): void;
    deselect(): void;

    setup(): void;
    teardown(): void;
    hotkey(hotkeyEvent: IHotkeyEvent);
}