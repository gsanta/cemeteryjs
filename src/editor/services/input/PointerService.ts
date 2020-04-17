import { Point } from "../../../misc/geometry/shapes/Point";
import { ServiceLocator } from '../ServiceLocator';
import { Stores } from "../../stores/Stores";
import { MousePointer } from "./MouseService";
import { Concept } from "../../views/canvas/models/concepts/Concept";
import { Feedback } from "../../views/canvas/models/feedbacks/Feedback";

export enum Wheel {
    IDLE = 'idle', UP = 'up', DOWN = 'down'
}

export interface IPointerEvent {
    pointers: {id: number, pos: Point}[];
    deltaY?: number;
    button: 'left' | 'right';
    isAltDown: boolean;
    isShiftDown: boolean;
    isCtrlDown: boolean;
    isMetaDown: boolean;
    preventDefault: () => void;
}

export class PointerService {
    serviceName = 'pointer-service';
    isDown = false;
    isDrag = false;
    wheel: Wheel = Wheel.IDLE;
    wheelState: number = 0;

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
        this.getStores().viewStore.getActiveView().getSelectedTool().down();
        this.getServices().updateService().runScheduledTasks();
    }

    pointerMove(e: IPointerEvent): void {
        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.getPointWithOffset(e.pointers[0].pos);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen =  this.getScreenPointWithOffset(e.pointers[0].pos);
        if (this.isDown && this.pointer.getDownDiff().len() > 2) {
            this.isDrag = true;
            this.getStores().viewStore.getActiveView().getSelectedTool().drag();
        } else {
            this.getStores().viewStore.getActiveView().getSelectedTool().move();
        }
        this.getServices().updateService().runScheduledTasks();
    }

    pointerUp(e: IPointerEvent): void {
        if (this.isDrag) {
            this.getStores().viewStore.getActiveView().getSelectedTool().draggedUp();
        } else {
            this.getStores().viewStore.getActiveView().getSelectedTool().click();
        }
        
        this.getStores().viewStore.getActiveView().getSelectedTool().up();
        this.isDown = false;
        this.isDrag = false;
        this.pointer.down = undefined;
        this.getServices().updateService().runScheduledTasks();
    }

    pointerOut(e: IPointerEvent): void {
        this.isDown = false;
        this.isDrag = false;
    }

    pointerWheel(e: IPointerEvent): void {
        this.wheelState += e.deltaY;

        if (e.deltaY < 0) {
            this.wheel = Wheel.UP;
        } else if (e.deltaY > 0) {
            this.wheel = Wheel.DOWN;
        } else {
            this.wheel = Wheel.IDLE;
        }

        this.getServices().hotkey.executePointerEvent(e)
    }

    pointerWheelEnd() {
        this.wheel = Wheel.IDLE;
    }

    hover(item: Concept | Feedback): void {
        this.getStores().viewStore.getActiveView().getSelectedTool().over(item);
        this.getServices().updateService().runScheduledTasks();
    }

    unhover(item: Concept | Feedback): void {
        this.getStores().viewStore.getActiveView().getSelectedTool().out(item);
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