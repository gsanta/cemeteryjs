import { IToolType } from "./IToolType";
import { View } from "../models/views/View";

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

export interface Tool {
    type: ToolType;
    down(): boolean;
    move(): boolean;
    drag(): boolean;
    click(): boolean;
    draggedUp(): boolean;
    up(): boolean;
    activate(): boolean;
    leave(): boolean;
    keydown(): boolean;
    over(item: View): boolean;
    out(item: View): boolean;

    select(): void;
    unselect(): void;

    getSubtools(): Tool[];
}