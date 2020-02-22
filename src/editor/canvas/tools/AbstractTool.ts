import { Tool, ToolType } from './Tool';
import { View } from '../../../common/views/View';

export class AbstractTool implements Tool {
    private subtools: Tool[] = [];
    type: ToolType;

    constructor(type: ToolType) {
        this.type = type;
    }

    supportsRectSelection(): boolean { return false; }

    down() {
        return !!this.getSubtools().find(tool => tool.down());
    }

    move() {
        return !!this.getSubtools().find(tool => tool.move());
    }

    drag() {}
    click() {
        return !!this.getSubtools().find(tool => tool.click());
    }

    draggedUp() {}
    up() {}
    activate() {}
    resize() {}
    exit() {}
    keydown() {}

    over(item: View) { 
        return !!this.getSubtools().find(tool => tool.over(item));
    }

    out(item: View) {
        return !!this.getSubtools().find(tool => tool.out(item));
    }

    getSubtools(): Tool[] {
        return [];
    }
}