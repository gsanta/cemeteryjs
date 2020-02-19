import { IPointerService, IPointerEvent } from "./IPointerService";
import { CanvasController } from "../canvas/CanvasController";
import { MousePointer } from "./MouseHandler";
import { Point } from "../../../../misc/geometry/shapes/Point";
import { View } from "../../../../common/views/View";
import { CanvasItemTag } from "../canvas/models/CanvasItem";

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

    hover(item: View): void {
        this.controller.tagService.addTag([item], CanvasItemTag.HOVERED);
        this.controller.renderWindow();
    }

    unhover(): void {
        this.controller.tagService.removeTagFromAll(CanvasItemTag.HOVERED);
        this.controller.renderWindow();
    }
    
    private addScreenOffset(point: Point): Point {
        const offset = this.calcOffset(this.controller.getId());
        return new Point(point.x - offset.x, point.y - offset.y);
    }
}