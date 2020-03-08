import { Point } from "../../misc/geometry/shapes/Point";
import { MousePointer } from "./MouseHandler";
import { View } from "./canvas/models/views/View";


export interface IPointerEvent {
    pointers: {id: number, pos: Point}[];
    deltaY?: number;
    preventDefault: () => void;
    button: 'left' | 'right';
}

export interface IPointerHandler {
    isDown: boolean;
    isDrag: boolean;
    pointer: MousePointer;
    pointerDown(e: IPointerEvent): void;
    pointerMove(e: IPointerEvent): void;
    pointerUp(e: IPointerEvent): void;
    pointerOut(e: IPointerEvent): void;
    hover(item: View): void;
    unhover(item: View): void;
}