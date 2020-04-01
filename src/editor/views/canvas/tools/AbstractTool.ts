import { IKeyboardEvent } from '../../../services/KeyboardService';
import { Concept } from '../models/concepts/Concept';
import { Feedback } from '../models/feedbacks/Feedback';
import { Tool, ToolType } from './Tool';

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
    over(item: Concept | Feedback) { }
    out(item: Concept | Feedback) { }
    leave() { }

    select(): void {}
    unselect(): void {}

    getSubtools(): Tool[] {
        return [];
    }
}