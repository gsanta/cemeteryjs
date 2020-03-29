import { Tool, ToolType } from './Tool';
import { Concept, Subconcept } from '../models/concepts/Concept';
import { IKeyboardEvent } from '../../../services/KeyboardService';

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
    keydown(e: IKeyboardEvent) { }
    over(item: Concept, subconcept?: Subconcept) { }
    out(item: Concept, subconcept?: Subconcept) { }
    leave() { }

    select(): void {}
    unselect(): void {}

    getSubtools(): Tool[] {
        return [];
    }
}