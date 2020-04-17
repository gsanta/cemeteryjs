import { IKeyboardEvent } from '../../../services/input/KeyboardService';
import { Concept } from '../models/concepts/Concept';
import { Feedback } from '../models/feedbacks/Feedback';
import { Tool, ToolType } from './Tool';
import { Stores } from '../../../stores/Stores';
import { ServiceLocator } from '../../../services/ServiceLocator';

export class AbstractTool implements Tool {
    type: ToolType;

    protected getStores: () => Stores;
    protected getServices: () => ServiceLocator;

    constructor(type: ToolType, getServices: () => ServiceLocator, getStores: () => Stores) {
        this.type = type;
        this.getServices = getServices;
        this.getStores = getStores;
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
}