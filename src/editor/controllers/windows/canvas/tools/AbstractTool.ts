import { Tool, ToolType } from './Tool';
import { View } from '../../../../../common/views/View';

export class AbstractTool implements Tool {
    private secondaryTool: Tool;
    type: ToolType;

    constructor(type: ToolType, secondaryTool?: Tool) {
        this.type = type;
        this.secondaryTool = secondaryTool;
    }

    supportsRectSelection(): boolean { return false; }

    down() {
        return this.secondaryTool && this.secondaryTool.down();
    }

    move() {
        return this.secondaryTool && this.secondaryTool.move();
    }

    drag() {}
    click() {
        return this.secondaryTool && this.secondaryTool.click();
    }

    draggedUp() {}
    up() {}
    activate() {}
    resize() {}
    exit() {}
    keydown() {}

    over(item: View) { 
        return this.secondaryTool && this.secondaryTool.over(item);
    }

    out(item: View) {
        return this.secondaryTool && this.secondaryTool.out(item);
    }
}