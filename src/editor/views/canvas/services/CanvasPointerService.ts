import { Point } from "../../../../misc/geometry/shapes/Point";
import { ServiceLocator } from '../../../services/ServiceLocator';
import { Stores } from "../../../stores/Stores";
import { IPointerEvent, IPointerHandler } from "../../IPointerHandler";
import { MousePointer } from "../../MouseHandler";
import { CanvasView } from "../CanvasView";

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

export class CanvasPointerService implements IPointerHandler {
    private view: CanvasView;
    isDown = false;
    isDrag = false;

    pointer: MousePointer = new MousePointer();

    private calcOffset: (id: string) => Point;
    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(view: CanvasView, getServices: () => ServiceLocator, getStores: () => Stores, calcOffset: (id: string) => Point = calcOffsetFromDom) {
        this.view = view;
        this.calcOffset = calcOffset;
        this.getServices = getServices;
        this.getStores = getStores;
    }

    pointerDown(e: IPointerEvent): void {
        if (e.button !== 'left') { return }

        this.isDown = true;
        this.pointer.down = this.getPointWithOffset(e.pointers[0].pos); 
        this.view.getActiveTool().down();
        this.getServices().updateService().runScheduledTasks();
    }

    pointerMove(e: IPointerEvent): void {
        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.getPointWithOffset(e.pointers[0].pos);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen =  this.getScreenPointWithOffset(e.pointers[0].pos);
        if (this.isDown && this.pointer.getDownDiff().len() > 2) {
            this.isDrag = true;
            this.view.getActiveTool().drag();
        } else {
            this.view.getActiveTool().move();
        }
        this.getServices().updateService().runScheduledTasks();
    }

    pointerUp(e: IPointerEvent): void {
        if (this.isDrag) {
            this.view.getActiveTool().draggedUp();
        } else {
            this.view.getActiveTool().click();
        }
        
        this.view.getActiveTool().up();
        this.isDown = false;
        this.isDrag = false;
        this.pointer.down = undefined;
        this.getServices().updateService().runScheduledTasks();
    }

    pointerOut(e: IPointerEvent): void {
        this.isDown = false;
        this.isDrag = false;
    }

    hover(item: any): void {
        this.view.getActiveTool().over(item);
        this.getServices().updateService().runScheduledTasks();
    }

    unhover(item: any): void {
        this.view.getActiveTool().out(item);
        this.getServices().updateService().runScheduledTasks();
    }
    
    private getScreenPointWithOffset(point: Point): Point {
        const offset = this.calcOffset(this.view.getId());
        return new Point(point.x - offset.x, point.y - offset.y);
    }

    private getPointWithOffset(point: Point): Point {
        const offset = this.calcOffset(this.view.getId());
        return this.getStores().viewStore.getActiveView().getCamera().screenToCanvasPoint(new Point(point.x - offset.x, point.y - offset.y));
    }
}