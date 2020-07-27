import { Registry } from "../../Registry";
import { Point } from "../../geometry/shapes/Point";
import { IPointerEvent } from "./PointerService";
import { DroppableItem } from "../../../plugins/common/tools/DragAndDropTool";
import { View } from "../../models/views/View";

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

    mouseDown(e: MouseEvent): void {
        if (!this.isLeftButton(e)) { return }

        this.registry.services.pointer.pointerDown(this.convertEvent(e, true));
    }
    
    mouseMove(e: MouseEvent): void {
        this.registry.services.pointer.pointerMove(this.convertEvent(e, this.registry.services.pointer.isDown));
    }    

    mouseUp(e: MouseEvent, droppedItemType?: string): void {
        if (this.isLeftButton(e)) {
            this.registry.services.pointer.pointerUp(this.convertEvent(e, false, droppedItemType));
        }

        this.registry.services.hotkey.focus();
    }

    mouseLeave(e: MouseEvent): void {
        this.registry.services.pointer.pointerOut(this.convertEvent(e, false));
    }

    mouseWheel(e: WheelEvent): void {
        const pointerEvent = this.convertEvent(e, false);
        pointerEvent.deltaY = e.deltaY;
        this.registry.services.pointer.pointerWheel(pointerEvent);
    }

    mouseWheelEnd(): void {
        this.registry.services.pointer.pointerWheelEnd();
    }

    hover(item: View) {
        this.registry.services.pointer.hover(item);
    }

    unhover(item: View) {
        this.registry.services.pointer.unhover(item);
    }

    dragStart(item: DroppableItem) {
        this.registry.services.pointer.pointerDragStart(item);
    }

    drop() {
        this.registry.services.pointer.pointerDrop();
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