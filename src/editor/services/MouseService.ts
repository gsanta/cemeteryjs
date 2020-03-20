import { Point } from "../../misc/geometry/shapes/Point";
import { Concept, Subconcept } from "../views/canvas/models/concepts/Concept";
import { ServiceLocator } from './ServiceLocator';
import { IPointerEvent } from "./PointerService";

export class MousePointer {
    down: Point;
    curr: Point;
    prev: Point;

    currScreen: Point;
    prevScreen: Point;

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

        this.getServices().pointerService().pointerDown(this.convertEvent(e));
    }
    
    onMouseMove(e: MouseEvent): void {
        this.getServices().pointerService().pointerMove(this.convertEvent(e));
    }    

    onMouseUp(e: MouseEvent): void {
        if (!this.isLeftButton(e)) { return }

        this.getServices().pointerService().pointerUp(this.convertEvent(e));
    }

    onMouseOut(e: MouseEvent): void {
        this.getServices().pointerService().pointerOut(this.convertEvent(e));
    }

    hover(item: Concept, subconcept?: Subconcept) {
        this.getServices().pointerService().hover(item, subconcept);
    }

    unhover(item: Concept, subconcept?: Subconcept) {
        this.getServices().pointerService().unhover(item, subconcept);
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