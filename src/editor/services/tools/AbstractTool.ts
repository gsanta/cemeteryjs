import { Registry } from '../../Registry';
import { Concept } from '../../views/canvas/models/concepts/Concept';
import { Feedback } from '../../views/canvas/models/feedbacks/Feedback';
import { IKeyboardEvent } from '../input/KeyboardService';
import { Tool, ToolType } from './Tool';

export class AbstractTool implements Tool {
    type: ToolType;

    protected registry: Registry;

    constructor(type: ToolType, registry: Registry) {
        this.type = type;
        this.registry = registry;
    }

    down() { }
    move() { }
    drag() { }
    click() { }
    draggedUp() { }
    up() { }
    activate() { }
    resize() { }
    wheel() {}
    wheelEnd() {}
    keydown(e: IKeyboardEvent) { }
    keyup(e: IKeyboardEvent){ }
    over(item: Concept | Feedback) { }
    out(item: Concept | Feedback) { }
    
    /**
     * Called when the mouse leaves the canvas.
     */
    leave() { }

    /**
     * Called when the tool is selected.
     */
    select(): void {}
    
    /**
     * Called when the tool is deselected.
     */
    deselect(): void {}

    setup(): void {};
    teardown(): void {};
}