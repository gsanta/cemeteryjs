import { Point } from "../../../misc/geometry/shapes/Point";
import { IPointerEvent, IPointerHandler } from "../IPointerHandler";
import { MousePointer } from "../MouseHandler";
import { RendererView } from "./RendererView";
import { Concept } from "../canvas/models/concepts/Concept";
import { Stores } from '../../stores/Stores';

export class RendererPointerService implements IPointerHandler {
    private controller: RendererView;
    isDown = false;
    isDrag = false;

    pointer: MousePointer = new MousePointer();

    private calcOffset: (id: string) => Point = () => new Point(0, 0);
    private getStores: () => Stores;

    constructor(controller: RendererView, getStores: () => Stores) {
        this.controller = controller;
        this.getStores = getStores;
    }

    pointerDown(e: IPointerEvent): void {
        if (e.button !== 'left') { return }

        this.isDown = true;
        this.pointer.down = this.getPointWithOffset(e.pointers[0].pos); 
        this.controller.getActiveTool().down();
    }

    pointerMove(e: IPointerEvent): void {
        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.getPointWithOffset(e.pointers[0].pos);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen =  this.getScreenPointWithOffset(e.pointers[0].pos);
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
    
    private getPointWithOffset(point: Point): Point {
        const offset = this.calcOffset(this.controller.getId());
        return this.getStores().viewStore.getActiveView().getCamera().screenToCanvasPoint(new Point(point.x - offset.x, point.y - offset.y));
    }

    private getScreenPointWithOffset(point: Point): Point {
        const offset = this.calcOffset(this.controller.getId());
        return new Point(point.x - offset.x, point.y - offset.y);
    }
}