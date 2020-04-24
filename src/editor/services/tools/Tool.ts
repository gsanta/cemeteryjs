import { IKeyboardEvent } from "../input/KeyboardService";
import { Concept } from "../../views/canvas/models/concepts/Concept";
import { Feedback } from "../../views/canvas/models/feedbacks/Feedback";

export enum ToolType {
    RECTANGLE = 'rectangle',
    DELETE = 'delete',
    SELECT = 'select',
    MOVE = 'move',
    PAN = 'pan',
    Zoom = 'zoom',
    PATH = 'arrow',
    Pointer = 'pointer'
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

export interface Tool {
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
    over(item: Concept | Feedback): void;
    out(item: Concept | Feedback): void;
    wheel(): void;
    wheelEnd(): void;

    select(): void;
    deselect(): void;
}