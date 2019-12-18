
export enum ToolType {
    RECTANGLE = 'rectangle',
    DELETE = 'delete',
    SELECT = 'select',
    MOVE_AND_SELECT = 'move-and-select',
    MOVE = 'move'
}

export interface Tool {
    type: ToolType;
    down();
    drag();
    click();
    draggedUp();
    up();
    activate();
}