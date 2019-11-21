
export enum ToolType {
    RECTANGLE = 'rectangle',
    DELETE = 'delete'
}

export interface Tool {
    type: ToolType;
    down();
    drag();
    click();
    draggedUp();
    up();
}