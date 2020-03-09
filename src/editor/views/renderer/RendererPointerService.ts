import { Point } from "../../../misc/geometry/shapes/Point";
import { IPointerEvent, IPointerHandler } from "../IPointerHandler";
import { MousePointer } from "../MouseHandler";
import { RendererView } from "./RendererView";
import { Concept } from "../canvas/models/concepts/Concept";

export class RendererPointerService implements IPointerHandler {
    private controller: RendererView;
    isDown = false;
    isDrag = false;

    pointer: MousePointer = new MousePointer();

    private calcOffset: (id: string) => Point;

    constructor(controller: RendererView) {
        this.controller = controller;
    }

    pointerDown(e: IPointerEvent): void {
        if (e.button !== 'left') { return }

        this.isDown = true;
        this.pointer.down = this.addScreenOffset(e.pointers[0].pos); 
        this.controller.getActiveTool().down();
    }

    pointerMove(e: IPointerEvent): void {
        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.addScreenOffset(e.pointers[0].pos);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen = this.controller.getCamera().screenToCanvasPoint(this.pointer.curr);
        if (this.isDown) {
            this.isDrag = true;
            this.controller.getActiveTool().drag();
        }
    }

    pointerUp(e: IPointerEvent): void {
        if (this.isDrag) {
            this.controller.getActiveTool().draggedUp();
        } else {
            this.controller.getActiveTool().click();
        }
        
        this.controller.getActiveTool().up();
        this.isDown = false;
        this.isDrag = false;
        this.pointer.down = undefined;
    }

    pointerOut(e: IPointerEvent): void {
        this.isDown = false;
        this.isDrag = false;
    }

    hover(item: Concept): void {}
    unhover(): void {}
    
    private addScreenOffset(point: Point): Point {
        const offset = new Point(0, 0);//this.calcOffset(this.controller.getId());
        return new Point(point.x - offset.x, point.y - offset.y);
    }
}