import { IPointerService, IPointerEvent } from "../../common/services/IPointerService";
import { CanvasWindow } from "../CanvasWindow";
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
    private controller: CanvasWindow;
    isDown = false;
    isDrag = false;

    pointer: MousePointer = new MousePointer();

    private calcOffset: (id: string) => Point;

    constructor(controller: CanvasWindow, calcOffset: (id: string) => Point = calcOffsetFromDom) {
        this.controller = controller;
        this.calcOffset = calcOffset;
    }

    pointerDown(e: IPointerEvent): void {
        if (e.button !== 'left') { return }

        this.isDown = true;
        this.pointer.down = this.getPointWithOffset(e.pointers[0].pos); 
        this.controller.toolService.getActiveTool().down();
        this.controller.updateService.runScheduledTasks();
    }

    pointerMove(e: IPointerEvent): void {
        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.getPointWithOffset(e.pointers[0].pos);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen =  this.getScreenPointWithOffset(e.pointers[0].pos);
        if (this.isDown && this.pointer.getDownDiff().len() > 2) {
            this.isDrag = true;
            this.controller.toolService.getActiveTool().drag();
        } else {
            this.controller.toolService.getActiveTool().move();
        }
        this.controller.updateService.runScheduledTasks();
    }

    pointerUp(e: IPointerEvent): void {
        console.log(this.controller.toolService.getActiveTool())
        if (this.isDrag) {
            this.controller.toolService.getActiveTool().draggedUp();
        } else {
            this.controller.toolService.getActiveTool().click();
        }
        
        this.controller.toolService.getActiveTool().up();
        this.isDown = false;
        this.isDrag = false;
        this.pointer.down = undefined;
        this.controller.updateService.runScheduledTasks();
    }

    pointerOut(e: IPointerEvent): void {
        this.isDown = false;
        this.isDrag = false;
    }

    hover(item: View): void {
        this.controller.toolService.getActiveTool().over(item);
        this.controller.updateService.runScheduledTasks();
    }

    unhover(item: View): void {
        this.controller.toolService.getActiveTool().out(item);
        this.controller.updateService.runScheduledTasks();
    }
    
    private getScreenPointWithOffset(point: Point): Point {
        const offset = this.calcOffset(this.controller.getId());
        return new Point(point.x - offset.x, point.y - offset.y);
    }

    private getPointWithOffset(point: Point): Point {
        const offset = this.calcOffset(this.controller.getId());
        return this.controller.toolService.cameraTool.getCamera().screenToCanvasPoint(new Point(point.x - offset.x, point.y - offset.y));
    }

}