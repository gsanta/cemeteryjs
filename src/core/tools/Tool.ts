import { IKeyboardEvent } from "../services/input/KeyboardService";
import { Concept } from "../../editor/models/concepts/Concept";
import { Feedback } from "../../editor/models/feedbacks/Feedback";

export enum ToolType {
    RECTANGLE = 'rectangle',
    DELETE = 'delete',
    SELECT = 'select',
    MOVE = 'move',
    Pan = 'pan',
    Zoom = 'zoom',
    PATH = 'arrow',
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