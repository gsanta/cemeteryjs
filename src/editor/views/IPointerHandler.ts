import { Point } from "../../misc/geometry/shapes/Point";
import { MousePointer } from "./MouseHandler";
import { Concept } from "./canvas/models/concepts/Concept";


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
    hover(item: Concept): void;
    unhover(item: Concept): void;
}