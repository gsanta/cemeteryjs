import { Tool, ToolType } from './Tool';
import { Concept } from '../models/concepts/Concept';

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
    over(item: Concept) { }
    out(item: Concept) { }
    leave() { }

    select(): void {}
    unselect(): void {}

    getSubtools(): Tool[] {
        return [];
    }
}