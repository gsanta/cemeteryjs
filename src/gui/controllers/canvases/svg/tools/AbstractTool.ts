import { Tool, ToolType } from './Tool';


export class AbstractTool implements Tool {
    type: ToolType;

    constructor(type: ToolType) {
        this.type = type;
    }

    down() {}
    drag() {}
    click() {}
    draggedUp() {}
    up() {}
    activate() {}
}