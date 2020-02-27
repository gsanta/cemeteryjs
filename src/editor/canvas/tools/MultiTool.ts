import { AbstractTool } from "./AbstractTool";
import { View } from "../models/views/View";

export abstract class MultiTool extends AbstractTool {
    down() {
        return !!(this.getSubtools().find(tool => tool.down()) || this.doDown());
    }
    move() {
        return !!(this.getSubtools().find(tool => tool.move()) || this.doMove());
    }
    drag() {
        return !!(this.getSubtools().find(tool => tool.drag()) || this.doDrag());
    }
    click() {
        return !!(this.getSubtools().find(tool => tool.click()) || this.doClick());
    }
    draggedUp() {
        return !!this.getSubtools().find(tool => tool.draggedUp()) || this.doDraggedUp();
    }
    up() {
        return !!(this.getSubtools().find(tool => tool.up()) || this.doUp());
    }
    keydown() {
        return !!this.getSubtools().find(tool => tool.keydown()) || this.doKeydown();
    }
    over(item: View): boolean {
        return !!(this.getSubtools().find(tool => tool.over(item)) || this.doOver(item));
    }
    out(item: View): boolean {
        return !!(this.getSubtools().find(tool => tool.out(item)) || this.doOut(item));
    }

    doUp(): boolean { return false; }
    doDown(): boolean { return false; }
    doMove(): boolean { return false; }
    doDrag(): boolean { return false; }
    doClick(): boolean { return false; }
    doDraggedUp(): boolean { return false; }
    doKeydown(): boolean { return false; }
    doOver(item: View): boolean { return false; }
    doOut(item: View): boolean { return false; }
}