import { Tool, ToolType, ToolReturnType } from './Tool';
import { View } from '../models/views/View';

export class AbstractTool implements Tool {
    type: ToolType;

    constructor(type: ToolType) {
        this.type = type;
    }

    down() { }
    move() { }
    drag() { }
    click() { }
    draggedUp() { }
    up() { }
    activate() { }
    resize() { }
    keydown() { }
    over(item: View) { }
    out(item: View) { }
    leave() { }

    select(): void {}
    unselect(): void {}

    getSubtools(): Tool[] {
        return [];
    }
}