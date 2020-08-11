import { IHotkey, IHotkeyEvent } from "../../services/input/HotkeyService";
import { IKeyboardEvent } from "../../services/input/KeyboardService";
import { View } from "../../stores/views/View";
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
    rectangleSelection: Rectangle;
    getCursor(): Cursor;
    id: ToolType;
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
    over(item: View): void;
    out(item: View): void;
    wheel(): void;
    wheelEnd(): void;

    select(): void;
    deselect(): void;

    teardown(): void;
    hotkey(hotkeyEvent: IHotkeyEvent);
}