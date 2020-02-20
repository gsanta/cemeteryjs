import { Tool, ToolType } from './Tool';
import { View } from '../../../../../common/views/View';

export class AbstractTool implements Tool {
    private subtools: Tool[] = [];
    type: ToolType;

    constructor(type: ToolType, subtools: Tool[] = []) {
        this.type = type;
        this.subtools = subtools;
    }

    supportsRectSelection(): boolean { return false; }

    down() {
        return !!this.subtools.find(tool => tool.down());
    }

    move() {
        return !!this.subtools.find(tool => tool.move());
    }

    drag() {}
    click() {
        return !!this.subtools.find(tool => tool.click());
    }

    draggedUp() {}
    up() {}
    activate() {}
    resize() {}
    exit() {}
    keydown() {}

    over(item: View) { 
        return !!this.subtools.find(tool => tool.over(item));
    }

    out(item: View) {
        return !!this.subtools.find(tool => tool.out(item));
    }

    getSubtools(): Tool[] {
        return [];
    }
}