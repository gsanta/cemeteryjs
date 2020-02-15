import { IToolType } from "./IToolType";

export enum ToolType {
    RECTANGLE = 'rectangle',
    DELETE = 'delete',
    SELECT = 'select',
    MOVE_AND_SELECT = 'move-and-select',
    MOVE = 'move',
    PAN = 'pan',
    CAMERA = 'camera',
    PATH = 'arrow'
}

export interface Tool {
    type: ToolType;
    supportsRectSelection(): boolean;
    down();
    drag();
    click();
    draggedUp();
    up();
    activate();
    exit();
    keydown();
}