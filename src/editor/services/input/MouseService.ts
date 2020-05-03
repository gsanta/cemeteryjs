import { Point } from "../../../misc/geometry/shapes/Point";
import { ServiceLocator } from '../ServiceLocator';
import { IPointerEvent } from "./PointerService";
import { Concept } from "../../models/concepts/Concept";
import { Feedback } from "../../models/feedbacks/Feedback";
import { Registry } from "../../Registry";

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
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    onMouseDown(e: MouseEvent): void {
        if (!this.isLeftButton(e)) { return }

        this.registry.services.pointer.pointerDown(this.convertEvent(e, true));
    }
    
    onMouseMove(e: MouseEvent): void {
        this.registry.services.pointer.pointerMove(this.convertEvent(e, this.registry.services.pointer.isDown));
    }    

    onMouseUp(e: MouseEvent): void {
        if (!this.isLeftButton(e)) { return }

        this.registry.services.pointer.pointerUp(this.convertEvent(e, false));
    }

    onMouseOut(e: MouseEvent): void {
        this.registry.services.pointer.pointerOut(this.convertEvent(e, false));
    }

    onMouseWheel(e: WheelEvent): void {
        const pointerEvent = this.convertEvent(e, false);
        pointerEvent.deltaY = e.deltaY;
        this.registry.services.pointer.pointerWheel(pointerEvent);
    }

    onMouseWheelEnd(): void {
        this.registry.services.pointer.pointerWheelEnd();
    }

    hover(item: Concept | Feedback) {
        this.registry.services.pointer.hover(item);
    }

    unhover(item: Concept | Feedback) {
        this.registry.services.pointer.unhover(item);
    }

    private convertEvent(e: MouseEvent, isPointerDown: boolean): IPointerEvent {
        return {
            pointers: [{id: 1, pos: new Point(e.x, e.y), isDown: isPointerDown}],
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