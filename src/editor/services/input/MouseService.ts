import { Point } from "../../../misc/geometry/shapes/Point";
import { ServiceLocator } from '../ServiceLocator';
import { IPointerEvent } from "./PointerService";
import { Concept } from "../../views/canvas/models/concepts/Concept";
import { Feedback } from "../../views/canvas/models/feedbacks/Feedback";

export class MousePointer {
    down: Point;
    curr: Point;
    prev: Point;

    currScreen: Point;
    prevScreen: Point;
    downScreen: Point;

    getDiff() {
        return this.curr.subtract(this.prev);
    }

    getDownDiff() {
        return this.curr.subtract(this.down);
    }

    getScreenDiff() {
        return this.prevScreen ? this.currScreen.subtract(this.prevScreen) : new Point(0, 0);
    }
}

export class MouseService {
    serviceName = 'mouse-service';
    private getServices: () => ServiceLocator;

    constructor(getServices: () => ServiceLocator) {
        this.getServices = getServices;
    }

    onMouseDown(e: MouseEvent): void {
        if (!this.isLeftButton(e)) { return }

        this.getServices().pointer.pointerDown(this.convertEvent(e));
    }
    
    onMouseMove(e: MouseEvent): void {
        this.getServices().pointer.pointerMove(this.convertEvent(e));
    }    

    onMouseUp(e: MouseEvent): void {
        if (!this.isLeftButton(e)) { return }

        this.getServices().pointer.pointerUp(this.convertEvent(e));
    }

    onMouseOut(e: MouseEvent): void {
        this.getServices().pointer.pointerOut(this.convertEvent(e));
    }

    onMouseWheel(e: WheelEvent): void {
        const pointerEvent = this.convertEvent(e);
        pointerEvent.deltaY = e.deltaY;
        this.getServices().pointer.pointerWheel(pointerEvent);
    }

    onMouseWheelEnd(): void {
        this.getServices().pointer.pointerWheelEnd();
    }

    hover(item: Concept | Feedback) {
        this.getServices().pointer.hover(item);
    }

    unhover(item: Concept | Feedback) {
        this.getServices().pointer.unhover(item);
    }

    private convertEvent(e: MouseEvent): IPointerEvent {
        return {
            pointers: [{id: 1, pos: new Point(e.x, e.y)}],
            preventDefault: () => e.preventDefault(),
            button: this.isLeftButton(e) ? 'left' : 'right',
            isAltDown: !!e.altKey,
            isShiftDown: !!e.shiftKey,
            isCtrlDown: !!e.ctrlKey,
            isMetaDown: !!e.metaKey
        };
    }

    private isLeftButton(e: MouseEvent) {
        var button = e.which || e.button;
        return button === 1;
    }
}