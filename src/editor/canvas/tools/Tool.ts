import { IToolType } from "./IToolType";
import { View } from "../models/views/View";

export enum ToolType {
    RECTANGLE = 'rectangle',
    DELETE = 'delete',
    SELECT = 'select',
    MOVE_AND_SELECT = 'move-and-select',
    MOVE = 'move',
    PAN = 'pan',
    CAMERA = 'camera',
    PATH = 'arrow',
    POINTER = 'pointer'
}

export interface Tool {
    type: ToolType;
    supportsRectSelection(): boolean;
    down(): boolean;
    move(): boolean;
    drag();
    click(): boolean;
    draggedUp();
    up();
    activate();
    exit();
    keydown();
    over(item: View): boolean;
    out(item: View): boolean;

    getSubtools(): Tool[];
}