
export enum ToolType {
    RECTANGLE = 'rectangle',
    DELETE = 'delete',
    SELECT = 'select'
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