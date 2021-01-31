import { Point } from "../../utils/geometry/shapes/Point";
import { Registry } from "../Registry";
import { Tool } from "../plugin/tools/Tool";
import { AbstractCanvasPanel } from "../plugin/AbstractCanvasPanel";

export enum Wheel {
    IDLE = 'idle', UP = 'up', DOWN = 'down'
}

export class PointerTracker<D> {
    down: Point;
    curr: Point;
    prev: Point;

    currScreen: Point;
    prevScreen: Point;
    downScreen: Point;
    droppedItemType: string;
    wheel: Wheel = Wheel.IDLE;
    wheelDiff: number = undefined;
    wheelState: number = 0;
    prevWheelState: number = 0;
    lastPointerEvent: IPointerEvent;
    data: D;

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


export enum IPointerEventType {
    PointerDown = 'PointerDown',
    PointerUp = 'PointerUp',
    PointerMove = 'PointerMove',
    PointerWheel = 'PointerWheel',
    PointerDrop = 'PointerDrop',
    PointerEnter = 'PointerEnter', 
    PointerLeave = 'PointerLeave' 
}

export interface IPointerEvent {
    eventType: IPointerEventType;
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

export class PointerHandler<D> {
    isDown = false;
    isDrag = false;
    hoveredView: D;
    dropType: string;

    // hoveredPlugin: AbstractCanvasPlugin;

    pointer: PointerTracker<D> = new PointerTracker();

    private registry: Registry;
    private canvas: AbstractCanvasPanel<D>;

    constructor(registry: Registry, canvas: AbstractCanvasPanel<D>) {
        this.registry = registry;
        this.canvas = canvas;
    }

    pointerDown(e: IPointerEvent, scopedToolId?: string): void {
        if (e.button !== 'left') { return }        
        if (!this.registry.ui.helper.hoveredPanel) { return; }
        
        this.isDown = true;
        this.pointer.down = this.getCanvasPoint(e.pointers[0].pos); 
        this.pointer.downScreen = this.getScreenPoint(e.pointers[0].pos); 
        this.pointer.lastPointerEvent = e;
        
        this.determineTool(scopedToolId).down(this.pointer);
        this.registry.services.render.reRenderScheduled();
    }

    pointerMove(e: IPointerEvent, scopedToolId?: string): void {
        if (!this.registry.ui.helper.hoveredPanel) { return; }

        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.getCanvasPoint(e.pointers[0].pos);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen =  this.getScreenPoint(e.pointers[0].pos);
        this.pointer.lastPointerEvent = e;

        const tool = this.determineTool(scopedToolId);

        if (this.isDown && this.pointer.getDownDiff().len() > 2) {
            this.isDrag = true;
            tool.drag(this.pointer);
        } else {
            tool.move(this.pointer);
        }
        this.canvas.hotkey.executeHotkey(e, this.pointer);
        this.registry.services.render.reRenderScheduled();
    }

    pointerUp(e: IPointerEvent, scopedToolId?: string): void {
        this.canvas.hotkey.focus();
        
        if (e.button !== 'left') { return; }

        this.pointer.droppedItemType = e.droppedItemId;
        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.getCanvasPoint(e.pointers[0].pos);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen =  this.getScreenPoint(e.pointers[0].pos);
        this.pointer.lastPointerEvent = e;

        const tool = this.determineTool(scopedToolId);

        this.isDrag ? tool.draggedUp(this.pointer) : tool.click(this.pointer); 
        
        this.canvas.tool.getActiveTool().up(this.pointer);
        this.isDown = false;
        this.isDrag = false;
        this.pointer.down = undefined;
        this.registry.services.render.reRenderScheduled();
    }

    pointerLeave(data: D, scopedToolId?: string): void {
        if (!this.registry.ui.helper.hoveredPanel) { return; }
        this.pointer.lastPointerEvent = undefined;
        this.determineTool(scopedToolId).out(data);

        this.registry.services.render.reRender(this.registry.ui.helper.hoveredPanel.region);
        this.hoveredView = undefined;
    }

    pointerEnter(data: D, scopedToolId?: string) {
        if (!this.registry.ui.helper.hoveredPanel) { return; }
        this.hoveredView = data;
        this.pointer.lastPointerEvent = undefined;

        this.canvas.hotkey.executeHotkey({ isHover: true }, this.pointer);

        this.determineTool(scopedToolId).over(data);

        this.registry.services.render.reRender(this.registry.ui.helper.hoveredPanel.region);
    }

    pointerWheel(e: IPointerEvent): void {
        this.pointer.prevWheelState = this.pointer.wheelState;
        this.pointer.wheelState += e.deltaY;
        this.pointer.wheelDiff = this.pointer.wheelState - this.pointer.prevWheelState;
        this.pointer.lastPointerEvent = e;

        if (e.deltaY < 0) {
            this.pointer.wheel = Wheel.UP;
        } else if (e.deltaY > 0) {
            this.pointer.wheel = Wheel.DOWN;
        } else {
            this.pointer.wheel = Wheel.IDLE;
        }

        this.canvas.hotkey.executeHotkey(e, this.pointer);
        this.canvas.tool.getActiveTool().wheel();
    }

    pointerWheelEnd() {
        this.pointer.wheel = Wheel.IDLE;
        this.pointer.lastPointerEvent = undefined;

        this.canvas.tool.getActiveTool().wheelEnd();
    }

    pointerDrop(e: IPointerEvent, scopedToolId?: string) {
        this.pointerUp(e, scopedToolId);
        this.registry.services.dragAndDropService.emitDrop();

        this.registry.services.render.reRenderAll();
    }

    private determineTool(scopedToolId?: string): Tool<D> {
        if (scopedToolId) {
            return this.canvas.tool.getToolById(scopedToolId);
        } else {
            return this.canvas.tool.getActiveTool();
        }

    }
    
    private getScreenPoint(point: Point): Point {
        const offset = this.registry.ui.helper.hoveredPanel.getOffset();
        return new Point(point.x - offset.x, point.y - offset.y);
    }
    
    private getCanvasPoint(point: Point): Point {
        const offset = this.registry.ui.helper.hoveredPanel.getOffset();
        return this.registry.ui.helper.hoveredPanel.getCamera().screenToCanvasPoint(new Point(point.x - offset.x, point.y - offset.y));
    }

    static convertMouseEvent(e: MouseEvent, isPointerDown: boolean, eventType: IPointerEventType): IPointerEvent {
        const button = e.which || e.button;

        return {
            eventType: eventType,
            pointers: [{id: 1, pos: new Point(e.x, e.y), isDown: isPointerDown}],
            preventDefault: () => e.preventDefault(),
            button: button === 1 ? 'left' : 'right',
            isAltDown: !!e.altKey,
            isShiftDown: !!e.shiftKey,
            isCtrlDown: !!e.ctrlKey,
            isMetaDown: !!e.metaKey,
        };
    }
}