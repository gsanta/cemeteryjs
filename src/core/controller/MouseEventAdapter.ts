import { Point } from "../../utils/geometry/shapes/Point";
import { IPointerEvent, IPointerEventType } from "./PointerHandler";


export class MouseEventAdapter {
    static mouseDown(e: MouseEvent): IPointerEvent {
        return this.convertEvent(e, true, IPointerEventType.PointerDown);
    }
    
    static mouseMove(e: MouseEvent): IPointerEvent {
        return this.convertEvent(e, false, IPointerEventType.PointerMove);
    }    

    static mouseUp(e: MouseEvent): IPointerEvent {
        return this.convertEvent(e, false, IPointerEventType.PointerUp);
    }

    static dndDrop(e: MouseEvent): IPointerEvent {
        return this.convertEvent(e, false, IPointerEventType.PointerDrop);
        // this.canvas.pointer.pointerUp(this.convertEvent(e, false, IPointerEventType.PointerDrop), scopedToolId);

        // this.registry.services.dragAndDropService.emitDrop();

        // this.registry.services.render.reRenderAll();
    }

    static mouseOut(e: MouseEvent, pickedItemId: string): IPointerEvent {
        const pointerEvent = this.convertEvent(e, false, IPointerEventType.PointerOut);
        pointerEvent.pickedItemId = pickedItemId;
        return pointerEvent;
    }

    static mouseOver(e: MouseEvent, pickedItemId: string): IPointerEvent {
        const pointerEvent = this.convertEvent(e, false, IPointerEventType.PointerOver);
        pointerEvent.pickedItemId = pickedItemId;
        return pointerEvent;
    }

    static mouseWheel(e: WheelEvent): IPointerEvent {
        const pointerEvent = this.convertEvent(e, false, IPointerEventType.PointerWheel);
        pointerEvent.deltaY = e.deltaY;
        return pointerEvent;
    }

    private static convertEvent(e: MouseEvent, isPointerDown: boolean, eventType: IPointerEventType): IPointerEvent {
        return {
            eventType: eventType,
            pointers: [{id: 1, pos: new Point(e.x, e.y), isDown: isPointerDown}],
            preventDefault: () => e.preventDefault(),
            button: this.isLeftButton(e) ? 'left' : 'right',
            isAltDown: !!e.altKey,
            isShiftDown: !!e.shiftKey,
            isCtrlDown: !!e.ctrlKey,
            isMetaDown: !!e.metaKey,
            pickedItemId: undefined
        };
    }

    private static isLeftButton(e: MouseEvent) {
        var button = e.which || e.button;
        return button === 1;
    }
}