
export enum ToolType {
    RECTANGLE = 'rectangle',
    DELETE = 'delete',
    SELECT = 'select',
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