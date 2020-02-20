import { View } from "../../../../common/views/View";
import { Point } from "../../../../misc/geometry/shapes/Point";
import { IPointerEvent, IPointerService } from "./IPointerService";

export class MousePointer {
    down: Point;
    curr: Point;
    prev: Point;

    currScreen: Point;
    prevScreen: Point;

    getDownDiff() {
        return this.curr.subtract(this.down);
    }

    getScreenDiff() {
        return this.prevScreen ? this.currScreen.subtract(this.prevScreen) : new Point(0, 0);
    }
}

export class MouseHandler {
    private controller: {pointer: IPointerService};

    constructor(controller: {pointer: IPointerService}) {
        this.controller = controller;
    }

    onMouseDown(e: MouseEvent): void {
        if (!this.isLeftButton(e)) { return }

        this.controller.pointer.pointerDown(this.convertEvent(e));
    }
    
    onMouseMove(e: MouseEvent): void {
        this.controller.pointer.pointerMove(this.convertEvent(e));
    }    

    onMouseUp(e: MouseEvent): void {
        if (!this.isLeftButton(e)) { return }

        this.controller.pointer.pointerUp(this.convertEvent(e));
    }

    onMouseOut(e: MouseEvent): void {
        this.controller.pointer.pointerOut(this.convertEvent(e));
    }

    hover(item: View) {
        this.controller.pointer.hover(item);
    }

    unhover(item: View) {
        this.controller.pointer.unhover(item);
    }

    private convertEvent(e: MouseEvent): IPointerEvent {
        return {
            pointers: [{id: 1, pos: new Point(e.x, e.y)}],
            preventDefault: () => e.preventDefault(),
            button: this.isLeftButton(e) ? 'left' : 'right'
        };
    }

    private isLeftButton(e: MouseEvent) {
        var button = e.which || e.button;
        return button === 1;
    }
}