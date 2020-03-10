import { Point } from "../../misc/geometry/shapes/Point";
import { ServiceLocator } from './ServiceLocator';
import { Stores } from "../stores/Stores";
import { MousePointer } from "./MouseService";

export interface IPointerEvent {
    pointers: {id: number, pos: Point}[];
    deltaY?: number;
    preventDefault: () => void;
    button: 'left' | 'right';
}

export class PointerService {
    serviceName = 'pointer-service';
    isDown = false;
    isDrag = false;

    pointer: MousePointer = new MousePointer();

    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        this.getServices = getServices;
        this.getStores = getStores;
    }

    pointerDown(e: IPointerEvent): void {
        if (e.button !== 'left') { return }

        this.isDown = true;
        this.pointer.down = this.getPointWithOffset(e.pointers[0].pos); 
        this.getStores().viewStore.getActiveView().getActiveTool().down();
        this.getServices().updateService().runScheduledTasks();
    }

    pointerMove(e: IPointerEvent): void {
        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.getPointWithOffset(e.pointers[0].pos);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen =  this.getScreenPointWithOffset(e.pointers[0].pos);
        if (this.isDown && this.pointer.getDownDiff().len() > 2) {
            this.isDrag = true;
            this.getStores().viewStore.getActiveView().getActiveTool().drag();
        } else {
            this.getStores().viewStore.getActiveView().getActiveTool().move();
        }
        this.getServices().updateService().runScheduledTasks();
    }

    pointerUp(e: IPointerEvent): void {
        if (this.isDrag) {
            this.getStores().viewStore.getActiveView().getActiveTool().draggedUp();
        } else {
            this.getStores().viewStore.getActiveView().getActiveTool().click();
        }
        
        this.getStores().viewStore.getActiveView().getActiveTool().up();
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
        this.getStores().viewStore.getActiveView().getActiveTool().over(item);
        this.getServices().updateService().runScheduledTasks();
    }

    unhover(item: any): void {
        this.getStores().viewStore.getActiveView().getActiveTool().out(item);
        this.getServices().updateService().runScheduledTasks();
    }
    
    private getScreenPointWithOffset(point: Point): Point {
        const offset = this.getStores().viewStore.getActiveView().getOffset();
        return new Point(point.x - offset.x, point.y - offset.y);
    }

    private getPointWithOffset(point: Point): Point {
        const offset = this.getStores().viewStore.getActiveView().getOffset();
        return this.getStores().viewStore.getActiveView().getCamera().screenToCanvasPoint(new Point(point.x - offset.x, point.y - offset.y));
    }
}