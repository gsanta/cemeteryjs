import { Concept, Subconcept } from "../models/concepts/Concept";
import { CanvasItem } from "../models/CanvasItem";
import { IKeyboardEvent } from "../../../services/KeyboardService";

export enum ToolType {
    RECTANGLE = 'rectangle',
    DELETE = 'delete',
    SELECT = 'select',
    MOVE = 'move',
    PAN = 'pan',
    CAMERA = 'camera',
    PATH = 'arrow',
    POINTER = 'pointer'
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
    over(canvasItem: CanvasItem): void;
    out(canvasItem: CanvasItem): void;

    select(): void;
    unselect(): void;

    getSubtools(): Tool[];
}