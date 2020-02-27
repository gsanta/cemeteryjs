import { IPointerService, IPointerEvent } from "../../common/services/IPointerService";
import { CanvasController } from "../CanvasController";
import { MousePointer } from "../../common/services/MouseHandler";
import { Point } from "../../../misc/geometry/shapes/Point";
import { View } from "../models/views/View";
import { CanvasItemTag } from "../models/CanvasItem";

function calcOffsetFromDom(bitmapEditorId: string): Point {
    if (typeof document !== 'undefined') {
        const editorElement: HTMLElement = document.getElementById(bitmapEditorId);
        if (editorElement) {
            const rect: ClientRect = editorElement.getBoundingClientRect();
            return new Point(rect.left - editorElement.scrollLeft, rect.top - editorElement.scrollTop);
        }
    }

    return new Point(0, 0);
}

export class CanvasPointerService implements IPointerService {
    private controller: CanvasController;
    isDown = false;
    isDrag = false;

    pointer: MousePointer = new MousePointer();

    private calcOffset: (id: string) => Point;

    constructor(controller: CanvasController, calcOffset: (id: string) => Point = calcOffsetFromDom) {
        this.controller = controller;
        this.calcOffset = calcOffset;
    }

    pointerDown(e: IPointerEvent): void {
        if (e.button !== 'left') { return }

        this.isDown = true;
        this.pointer.down = this.getPointWithOffset(e.pointers[0].pos); 
        this.controller.getActiveTool().down() && this.controller.renderWindow();
    }

    pointerMove(e: IPointerEvent): void {
        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.getPointWithOffset(e.pointers[0].pos);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen =  this.getScreenPointWithOffset(e.pointers[0].pos);
        let updated = false;
        if (this.isDown && this.pointer.getDownDiff().len() > 2) {
            this.isDrag = true;
            updated = this.controller.getActiveTool().drag();
        } else {
            updated = this.controller.getActiveTool().move();
        }

        updated && this.controller.renderWindow();
    }

    pointerUp(e: IPointerEvent): void {
        console.log(this.controller.getActiveTool())
        let update = false;
        if (this.isDrag) {
            update = this.controller.getActiveTool().draggedUp();
        } else {
            update = this.controller.getActiveTool().click();
        }
        
        this.controller.getActiveTool().up();
        this.isDown = false;
        this.isDrag = false;
        this.pointer.down = undefined;

        update && this.controller.renderWindow()
    }

    pointerOut(e: IPointerEvent): void {
        this.isDown = false;
        this.isDrag = false;
    }

    hover(item: View): void {
        this.controller.getActiveTool().over(item) && this.controller.renderWindow();
    }

    unhover(item: View): void {
        this.controller.getActiveTool().out(item) && this.controller.renderWindow();
    }
    
    private getScreenPointWithOffset(point: Point): Point {
        const offset = this.calcOffset(this.controller.getId());
        return new Point(point.x - offset.x, point.y - offset.y);
    }

    private getPointWithOffset(point: Point): Point {
        const offset = this.calcOffset(this.controller.getId());
        return this.controller.getCamera().screenToCanvasPoint(new Point(point.x - offset.x, point.y - offset.y));
    }

}