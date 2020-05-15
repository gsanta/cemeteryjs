import { Registry } from "../../Registry";
import { Point } from "../../geometry/shapes/Point";
import { IPointerEvent } from "./PointerService";
import { Hoverable } from "../../models/Hoverable";

export class MousePointer {
    down: Point;
    curr: Point;
    prev: Point;

    currScreen: Point;
    prevScreen: Point;
    downScreen: Point;
    droppedItemType: string;

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

    onMouseUp(e: MouseEvent, droppedItemType?: string): void {
        if (!this.isLeftButton(e)) { return }

        this.registry.services.pointer.pointerUp(this.convertEvent(e, false, droppedItemType));
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

    hover(item: Hoverable) {
        console.log(item.type)
        this.registry.services.pointer.hover(item);
    }

    unhover(item: Hoverable) {
        this.registry.services.pointer.unhover(item);
    }

    private convertEvent(e: MouseEvent, isPointerDown: boolean, droppedItemId?: string): IPointerEvent {
        return {
            pointers: [{id: 1, pos: new Point(e.x, e.y), isDown: isPointerDown}],
            preventDefault: () => e.preventDefault(),
            button: this.isLeftButton(e) ? 'left' : 'right',
            isAltDown: !!e.altKey,
            isShiftDown: !!e.shiftKey,
            isCtrlDown: !!e.ctrlKey,
            isMetaDown: !!e.metaKey,
            droppedItemId: droppedItemId
        };
    }

    private isLeftButton(e: MouseEvent) {
        var button = e.which || e.button;
        return button === 1;
    }
}