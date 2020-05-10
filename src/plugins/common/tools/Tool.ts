import { IKeyboardEvent } from "../../../core/services/input/KeyboardService";
import { Feedback } from "../../../core/models/feedbacks/Feedback";
import { Concept } from "../../../core/models/concepts/Concept";

export enum ToolType {
    Rectangle = 'rectangle',
    Delete = 'delete',
    Select = 'select',
    Move = 'move',
    Pan = 'pan',
    DragAndDrop = 'drag-and-drop',
    Zoom = 'zoom',
    Path = 'arrow',
    Pointer = 'pointer',
    Gamepad = 'gamepad'
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
    Grab = 'grab',
}

export interface Tool {
    cursor: Cursor;
    type: ToolType;
    down(): void;
    move(): void;
    drag(): void;
    click(): void;
    draggedUp(): void;
    up(): void;
    activate(): void;
    leave(): void;
    keydown(e: IKeyboardEvent): void;
    keyup(e: IKeyboardEvent): void;
    over(item: Concept | Feedback): void;
    out(item: Concept | Feedback): void;
    wheel(): void;
    wheelEnd(): void;

    select(): void;
    deselect(): void;

    setup(): void;
    teardown(): void;
}