import { Tool, ToolType } from './Tool';
import { View } from '../models/views/View';

export class AbstractTool implements Tool {
    type: ToolType;

    constructor(type: ToolType) {
        this.type = type;
    }

    down() { return false; }
    move() { return false; }
    drag() { return false; }
    click() { return false; }
    draggedUp() { return false; }
    up() { return false; }
    activate() { return false; }
    resize() {}
    keydown() { return false; }
    over(item: View) { return false; }
    out(item: View) { return false; }
    leave() { return false; }

    select(): void {}
    unselect(): void {}

    getSubtools(): Tool[] {
        return [];
    }
}