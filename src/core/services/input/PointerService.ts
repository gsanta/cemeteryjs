import { Point } from "../../../utils/geometry/shapes/Point";
import { View } from "../../models/views/View";
import { Registry } from "../../Registry";
import { MousePointer } from "../../plugin/controller/ToolController";

export enum Wheel {
    IDLE = 'idle', UP = 'up', DOWN = 'down'
}

export interface IPointerEvent {
    pointers: {id: number, pos: Point, isDown: boolean}[];
    deltaY?: number;
    button: 'left' | 'right';
    isAltDown: boolean;
    isShiftDown: boolean;
    isCtrlDown: boolean;
    isMetaDown: boolean;
    droppedItemId?: string;
    preventDefault: () => void;
}

export class PointerService {
    isDown = false;
    isDrag = false;
    wheel: Wheel = Wheel.IDLE;
    wheelState: number = 0;
    prevWheelState: number = 0;
    wheelDiff: number = undefined;
    hoveredItem: View;
    dropType: string;

    // hoveredPlugin: AbstractCanvasPlugin;

    pointer: MousePointer = new MousePointer();

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    pointerDown(e: IPointerEvent): void {
        if (!this.registry.plugins.getHoveredPlugin()) { return; }
        if (e.button !== 'left') { return }
        this.isDown = true;
        this.pointer.down = this.getCanvasPoint(e.pointers[0].pos); 
        this.pointer.downScreen = this.getScreenPoint(e.pointers[0].pos); 
        this.registry.plugins.getHoveredPlugin().toolController.getActiveTool().down(e);
        this.registry.services.render.reRenderScheduled();
    }

    pointerMove(e: IPointerEvent): void {
        if (!this.registry.plugins.getHoveredPlugin()) { return; }

        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.getCanvasPoint(e.pointers[0].pos);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen =  this.getScreenPoint(e.pointers[0].pos);
        if (this.isDown && this.pointer.getDownDiff().len() > 2) {
            this.isDrag = true;
            this.registry.plugins.getHoveredPlugin().toolController.getActiveTool().drag(e);
        } else {
            this.registry.plugins.getHoveredPlugin().toolController.getActiveTool().move();
        }
        this.registry.services.hotkey.executeHotkey(e);
        this.registry.services.render.reRenderScheduled();
    }

    pointerUp(e: IPointerEvent): void {
        this.pointer.droppedItemType = e.droppedItemId;
        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.getCanvasPoint(e.pointers[0].pos);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen =  this.getScreenPoint(e.pointers[0].pos);

        if (this.isDrag) {
            this.registry.plugins.getHoveredPlugin().toolController.getActiveTool().draggedUp();
        } else {
            this.registry.plugins.getHoveredPlugin().toolController.getActiveTool().click();
        }
        
        this.registry.plugins.getHoveredPlugin().toolController.getActiveTool().up(e);
        this.isDown = false;
        this.isDrag = false;
        this.pointer.down = undefined;
        this.registry.services.render.reRenderScheduled();
    }

    pointerLeave(e: IPointerEvent, data: View): void {
        if (!this.registry.plugins.getHoveredPlugin()) { return; }
            this.registry.plugins.getHoveredPlugin().toolController.getActiveTool().out(data);

            this.registry.services.render.reRender(this.registry.plugins.getHoveredPlugin().region);
            this.hoveredItem = undefined;
    }

    pointerOver() {
    }

    pointerEnter(e: IPointerEvent, data: View) {
        if (!this.registry.plugins.getHoveredPlugin()) { return; }
        this.hoveredItem = data;

        this.registry.services.hotkey.executeHotkey({
            isHover: true
        });

        this.registry.plugins.getHoveredPlugin().toolController.getActiveTool().over(data);

        this.registry.services.render.reRender(this.registry.plugins.getHoveredPlugin().region);
    }

    pointerWheel(e: IPointerEvent): void {
        this.prevWheelState = this.wheelState;
        this.wheelState += e.deltaY;
        this.wheelDiff = this.wheelState - this.prevWheelState;

        if (e.deltaY < 0) {
            this.wheel = Wheel.UP;
        } else if (e.deltaY > 0) {
            this.wheel = Wheel.DOWN;
        } else {
            this.wheel = Wheel.IDLE;
        }

        this.registry.services.hotkey.executeHotkey(e);
        this.registry.plugins.getHoveredPlugin().toolController.getActiveTool().wheel();
    }

    pointerWheelEnd() {
        this.wheel = Wheel.IDLE;

        this.registry.plugins.getHoveredPlugin().toolController.getActiveTool().wheelEnd();
    }

    hover(item: View): void {
        this.hoveredItem = item;
        this.registry.services.hotkey.executeHotkey({
            isHover: true
        });
        this.registry.plugins.getHoveredPlugin().toolController.getActiveTool().over(item);
        this.registry.services.render.reRenderScheduled();
    }

    unhover(item: View): void {
        this.registry.services.hotkey.executeHotkey({
            isUnhover: true
        });
        if (this.hoveredItem === item) {
            this.hoveredItem = undefined;
        }
        this.registry.plugins.getHoveredPlugin().toolController.getActiveTool().out(item);
        this.registry.services.render.reRenderScheduled();
    }
    
    private getScreenPoint(point: Point): Point {
        const offset = this.registry.plugins.getHoveredPlugin().getOffset();
        return new Point(point.x - offset.x, point.y - offset.y);
    }
    
    private getCanvasPoint(point: Point): Point {
        const offset = this.registry.plugins.getHoveredPlugin().getOffset();
        return this.registry.plugins.getHoveredPlugin().getCamera().screenToCanvasPoint(new Point(point.x - offset.x, point.y - offset.y));
    }
}