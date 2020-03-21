import { Tool, ToolType } from './Tool';
import { Concept, Subconcept } from '../models/concepts/Concept';

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
    over(item: Concept, subconcept?: Subconcept) { }
    out(item: Concept, subconcept?: Subconcept) { }
    leave() { }

    select(): void {}
    unselect(): void {}

    getSubtools(): Tool[] {
        return [];
    }
}